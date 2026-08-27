const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const models = ['llama-3.3-70b-versatile','llama-3.1-8b-instant'];
async function groq(messages, key){
  let last;
  for(const model of models){
    const response=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify({model,temperature:.45,messages,response_format:{type:'json_object'}})});
    const data=await response.json();
    if(response.ok) return JSON.parse(data?.choices?.[0]?.message?.content||'{}');
    last=data?.error?.message||'Groq request failed.';
  }
  throw new Error(last||'Groq request failed.');
}
app.post('/api/groq/plan', async (req,res)=>{
  const key=process.env.GROQ_API_KEY, idea=String(req.body?.idea||'').trim(), lang=req.body?.lang||'pt';
  if(!key) return res.status(503).json({error:'GROQ_API_KEY is not configured on the server.'});
  if(!idea) return res.status(400).json({error:'Idea is required.'});
  const language=lang==='en'?'English':lang==='fr'?'French':'Portuguese';
  try{
    const data=await groq([
      {role:'system',content:`You are ZERO, an intelligent project-building companion. Help the user turn one idea into a real project and then guide them step by step. Respond only valid JSON in ${language}. Create exactly four stages. Each stage needs a concise title, a useful description, and one practical question the user should answer before moving forward. The stages must progressively cover: defining the problem and audience, shaping the solution, building the first version, and launch. Never fabricate personal information.`},
      {role:'user',content:`Idea: ${idea}\nReturn JSON: {"name":"short project name","type":"App|Business|Product|Game|Other","stages":[{"title":"...","description":"...","question":"..."},{"title":"...","description":"...","question":"..."},{"title":"...","description":"...","question":"..."},{"title":"...","description":"...","question":"..."}]}`}
    ],key);
    res.json(data);
  }catch(e){res.status(500).json({error:e.message});}
});

app.post('/api/groq/coach', async (req,res)=>{
  const key=process.env.GROQ_API_KEY;
  if(!key) return res.status(503).json({error:'GROQ_API_KEY is not configured on the server.'});
  const {idea,name,type,stages,answers,step,lang='pt'}=req.body||{};
  const language=lang==='en'?'English':lang==='fr'?'French':'Portuguese';
  try{
    const data=await groq([
      {role:'system',content:`You are ZERO Coach. You guide a person through building their own project one step at a time. Use the existing project context and the user's answer. Do not restart the process. Respond only JSON in ${language}. Give a short useful reflection for the current stage and prepare the next stage with a specific title, description and question. Be practical, encouraging and concise.`},
      {role:'user',content:JSON.stringify({project:{name,idea,type},stages,answers,currentStep:step})+`\nReturn JSON: {"stage":{"title":"...","description":"...","question":"..."},"nextStage":{"title":"...","description":"...","question":"..."}}`}
    ],key);
    res.json(data);
  }catch(e){res.status(500).json({error:e.message});}
});

const port=process.env.PORT||3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`ZERO running on port ${port}`);
});
