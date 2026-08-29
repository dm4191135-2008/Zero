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
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
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

async function groq(messages, key) {
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
          max_tokens: 6500,
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
            max_tokens: 6500,
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
        content: `You are ZERO, a practical project-building coach. Respond ONLY with valid JSON in ${language}.

The user has already provided a project idea. Do not ask a long list of questions. Use the current answer and existing project context to improve the current stage and prepare the next stage.

Return exactly:
{
  "stage":{"title":"short stage title","description":"clear practical description","goal":"what should be achieved","deliverable":"concrete output"},
  "nextStage":{"title":"short next stage title","description":"clear practical description","goal":"what should be achieved","deliverable":"concrete output"},
  "coachMessage":"one short useful message"
}

Be specific to the project. Do not invent factual market data.`
      },
      {
        role: 'user',
        content: JSON.stringify({
          project: { idea, name, type },
          currentStage: stages?.[currentStep] || {},
          allStages: Array.isArray(stages) ? stages : [],
          answers: Array.isArray(answers) ? answers : [],
          step: currentStep
        })
      }
    ], key);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Could not coach the project.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`ZERO running on port ${port}`));
