const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    port: Number(process.env.PORT || 3000)
  });
});

// Preferred models, in order. The server first checks which models the
// current Groq project/key can actually access, so an unavailable model
// does not break the whole ZERO analysis feature.
const preferredModels = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant'
];

async function getAvailableModels(key) {
  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || `Groq models request failed (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return Array.isArray(data?.data)
    ? data.data.map(model => model?.id).filter(Boolean)
    : [];
}

async function getModelsForKey(key) {
  const available = await getAvailableModels(key);
  const selected = preferredModels.filter(model => available.includes(model));

  if (!selected.length) {
    throw new Error(
      'A tua chave Groq não tem acesso a nenhum dos modelos suportados pelo ZERO. ' +
      'Verifica a chave, o projeto e as permissões de modelos no GroqCloud.'
    );
  }

  return selected;
}

function languageName(lang) {
  return lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Portuguese';
}

function getGroqKey() {
  return String(process.env.GROQ_API_KEY || '').trim();
}

async function groq(messages, key, options = {}) {
  const cleanKey = String(key || '').trim();
  if (!cleanKey) throw new Error('GROQ_API_KEY is missing. Check the .env file.');

  const models = await getModelsForKey(cleanKey);
  let last = 'Groq request failed.';

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      let response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanKey}`
        },
        body: JSON.stringify({
          model,
          temperature: 0.35,
          max_tokens: Math.min(Number(options.maxTokens) || 1800, 1800),
          messages,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      let data = await response.json().catch(() => ({}));

      // Some model/account combinations can reject JSON mode. Retry the
      // same model without response_format before moving to another model.
      if (!response.ok && response.status === 400) {
        const retryController = new AbortController();
        const retryTimeout = setTimeout(() => retryController.abort(), 45000);

        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanKey}`
          },
          body: JSON.stringify({
            model,
            temperature: 0.35,
            max_tokens: Math.min(Number(options.maxTokens) || 1800, 1800),
            messages
          }),
          signal: retryController.signal
        });

        clearTimeout(retryTimeout);
        data = await response.json().catch(() => ({}));
      }

      if (response.ok) {
        const content = data?.choices?.[0]?.message?.content;
        if (!content) throw new Error('Groq returned an empty response.');

        try {
          return JSON.parse(content);
        } catch {
          // Try extracting a JSON object if the model wrapped it in text.
          const match = String(content).match(/\{[\s\S]*\}/);
          if (match) return JSON.parse(match[0]);
          throw new Error('Groq returned invalid JSON.');
        }
      }

      const message = data?.error?.message || `Groq returned HTTP ${response.status}.`;

      if (response.status === 401 || response.status === 403) {
        throw new Error(`Groq authentication/permission error (${response.status}): ${message}`);
      }

      last = message;
    } catch (err) {
      last = err.name === 'AbortError'
        ? 'Groq request timed out after 45 seconds.'
        : (err.message || last);

      if (/authentication|permission|HTTP 401|HTTP 403/i.test(last)) break;
    }
  }

  throw new Error(last);
}

app.get('/api/groq/test', async (req, res) => {
  const key = getGroqKey();

  if (!key) {
    return res.status(503).json({
      ok: false,
      configured: false,
      error: 'GROQ_API_KEY is missing. Put your key in Zero/.env.'
    });
  }

  try {
    await groq([
      { role: 'user', content: 'Reply with exactly this JSON: {"ok":true}' }
    ], key);

    res.json({ ok: true, configured: true, message: 'Groq API key is working.' });
  } catch (err) {
    res.status(502).json({
      ok: false,
      configured: true,
      error: err.message || 'Groq API test failed.'
    });
  }
});

app.post('/api/groq/analyze', async (req, res) => {
  const key = getGroqKey();
  const idea = String(req.body?.idea || '').trim();
  const lang = req.body?.lang || 'pt';

  if (!key) return res.status(503).json({ error: 'GROQ_API_KEY is not configured on the server.' });
  if (!idea) return res.status(400).json({ error: 'Idea is required.' });
  if (idea.length > 5000) return res.status(400).json({ error: 'Idea is too long. Keep it concise.' });

  const language = languageName(lang);

  try {
    const data = await groq([
      {
        role: 'system',
        content: `You are ZERO, an autonomous project-building strategist. The user should do almost no work: they provide only one idea, and you turn it into a useful project blueprint. Respond ONLY with valid JSON in ${language}.

IMPORTANT TRUTHFULNESS RULES:
- You do not have live web browsing in this request. Do not claim that competitor or market information is live, current, verified, or researched on the internet.
- Competitor names may be well-known examples from your knowledge. If uncertain, say so briefly in the relevant field.
- Do not invent exact market sizes, revenue figures, user counts, prices, legal requirements, or statistics. Use qualitative labels such as "em crescimento", "competitivo", "entrada moderada" or "validar" when exact data is unavailable.
- Never fabricate personal information about the user.

Your job is to infer the maximum useful amount from the single idea. Do NOT ask the user a long list of questions. Create exactly one coherent analysis with: a project name, project type, concept, summary, problem, opportunity, target audience, audience need, solution, differentiator, core features, market assessment, competitor landscape, SWOT/FOFA, business model, risks, roadmap and one first move.

Make the result practical, concise and specific to the idea. Avoid generic startup advice. The roadmap must be actionable and ordered. Core features should describe an MVP, not a giant product.

Return exactly this JSON shape:
{
  "name":"short memorable project name",
  "type":"App|Negócio|Produto|Jogo|Serviço|Outro",
  "concept":"one sentence",
  "summary":"short explanation",
  "problem":"problem being solved",
  "opportunity":"why this could matter",
  "targetAudience":"primary audience",
  "audienceNeed":"what they need",
  "solution":"how the project solves it",
  "differentiator":"strongest plausible differentiation",
  "coreFeatures":["feature 1","feature 2","feature 3","feature 4","feature 5"],
  "market":{"summary":"qualitative market assessment","size":"Validar","trend":"qualitative trend","entry":"qualitative entry difficulty"},
  "competitors":[{"name":"known competitor or alternative","description":"what it does","weakness":"gap/opportunity to differentiate; if uncertain say 'validar'"}],
  "swot":{"strengths":["..."],"weaknesses":["..."],"opportunities":["..."],"threats":["..."]},
  "businessModel":{"recommendation":"best initial model","revenueStreams":["..."]},
  "risks":["risk 1","risk 2","risk 3"],
  "roadmap":[{"title":"Validate","action":"..."},{"title":"MVP","action":"..."},{"title":"Test","action":"..."},{"title":"Launch","action":"..."}],
  "viabilityScore":0,
  "verdict":"short verdict",
  "scoreReason":"one sentence explaining the score",
  "firstMove":"one concrete thing the user can do next",
  "firstMoveWhy":"why this should happen first",
  "disclaimer":"short note that market/competitor insights are AI estimates and should be validated"
}

Score viability from 0 to 100 based on clarity of problem, plausibility of audience need, differentiation potential and execution difficulty. This is a heuristic, not a factual prediction.`
      },
      {
        role: 'user',
        content: `The user's entire input is one idea. Do the thinking for them. Idea: ${idea}`
      }
    ], key);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not analyze the idea.' });
  }
});



const LEVELS = [
  { key: 'name', title: 'Nome', goal: 'Escolher um nome forte para o projeto.' },
  { key: 'positioning', title: 'Posicionamento', goal: 'Escolher como o projeto deve ser percebido.' },
  { key: 'differentiator', title: 'Diferencial', goal: 'Encontrar uma vantagem clara perante alternativas.' },
  { key: 'marketing', title: 'Marketing', goal: 'Escolher uma estratégia simples para conseguir os primeiros utilizadores.' },
  { key: 'business', title: 'Modelo de negócio', goal: 'Escolher a forma mais adequada de gerar receita.' },
  { key: 'launch', title: 'Lançamento', goal: 'Definir os primeiros passos para validar e lançar.' },
  { key: 'final', title: 'Plano final', goal: 'Juntar as decisões num plano executável.' }
];

function compactProjectContext(project, completed, step) {
  const a = project?.analysis || {};
  return {
    idea: String(project?.idea || '').slice(0, 1200),
    type: project?.type || '',
    originalName: project?.name || '',
    problem: String(a.problem || '').slice(0, 500),
    audience: String(a.targetAudience || '').slice(0, 500),
    solution: String(a.solution || '').slice(0, 500),
    market: String(a.market?.summary || '').slice(0, 500),
    competitors: (Array.isArray(a.competitors) ? a.competitors : []).slice(0, 4).map(c => ({ name: c?.name || '', weakness: String(c?.weakness || '').slice(0, 250) })),
    completed: completed || {},
    currentLevel: LEVELS[step]?.key || 'name'
  };
}

app.post('/api/groq/level', async (req, res) => {
  const key = getGroqKey();
  const { project, step, lang } = req.body || {};
  const currentStep = Math.max(0, Math.min(6, Number(step) || 0));
  const language = languageName(lang || 'pt');

  if (!key) return res.status(503).json({ error: 'GROQ_API_KEY is not configured on the server.' });
  if (!String(project?.idea || '').trim()) return res.status(400).json({ error: 'Idea is required.' });

  const level = LEVELS[currentStep];
  try {
    const data = await groq([
      {
        role: 'system',
        content: `You are ZERO, a concise project-building strategist. Respond ONLY with valid JSON in ${language}.

The user has already completed the main project analysis. This is ONE small decision level. Never ask the user to type a long answer. Give 3 to 5 concrete choices that can be selected with one click.

Rules:
- Use only the project context supplied. Do not claim live browsing or verified market research.
- Do not invent exact statistics, market sizes, revenue, prices or legal facts.
- Make choices clearly different and specific to this project, not generic startup advice.
- Keep each option short enough for a card/button.
- For the name level, suggest memorable names and a one-line reason.
- For positioning, suggest distinct positioning statements.
- For differentiator, suggest specific advantages.
- For marketing, suggest practical acquisition strategies.
- For business, suggest realistic initial revenue models without fabricated prices.
- For launch, suggest concrete first validation/launch moves.
- For final, return a concise final plan based on the completed choices.

Return exactly:
{
  "level":"${level.key}",
  "title":"${level.title}",
  "message":"one short sentence",
  "options":[{"id":"a","title":"short choice","description":"one short explanation"},{"id":"b","title":"short choice","description":"one short explanation"},{"id":"c","title":"short choice","description":"one short explanation"}],
  "nextLabel":"short label for continuing"
}
For the final level, options may be empty and message should summarize the recommended plan.`
      },
      {
        role: 'user',
        content: JSON.stringify(compactProjectContext(project, project?.choices || {}, currentStep))
      }
    ], key, { maxTokens: 950 });

    res.json({ ...data, step: currentStep, totalLevels: LEVELS.length });
  } catch (err) {
    const message = err.message || 'Could not generate the next level.';
    const status = /rate limit|tokens per minute|TPM|too many requests/i.test(message) ? 429 : 500;
    res.status(status).json({ error: message });
  }
});

app.post('/api/groq/coach', async (req, res) => {
  const key = getGroqKey();
  const { idea, name, type, stages, answers, step, lang } = req.body || {};

  if (!key) return res.status(503).json({ error: 'GROQ_API_KEY is not configured on the server.' });
  if (!String(idea || '').trim()) return res.status(400).json({ error: 'Idea is required.' });

  const currentStep = Math.max(0, Math.min(3, Number(step) || 0));
  const language = languageName(lang || 'pt');

  try {
    const data = await groq([
      {
        role: 'system',
        content: `You are ZERO, a practical project-building coach. Respond ONLY with valid JSON in ${language}. Use short output. Return exactly: {"stage":{"title":"short title","description":"short description","goal":"short goal","deliverable":"short deliverable"},"nextStage":{"title":"short title","description":"short description","goal":"short goal","deliverable":"short deliverable"},"coachMessage":"one short message"}. Do not invent factual market data.`
      },
      {
        role: 'user',
        content: JSON.stringify({ project: { idea: String(idea).slice(0,1200), name, type }, currentStage: stages?.[currentStep] || {}, answer: Array.isArray(answers) ? answers[currentStep] : '', step: currentStep })
      }
    ], key, { maxTokens: 650 });

    res.json(data);
  } catch (err) {
    const message = err.message || 'Could not coach the project.';
    const status = /rate limit|tokens per minute|TPM|too many requests/i.test(message) ? 429 : 500;
    res.status(status).json({ error: message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`ZERO running on port ${port}`));
