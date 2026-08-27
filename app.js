const app = document.querySelector('#app');
// COLOCA AQUI O CAMINHO DO ÍCONE DA APP. Ex.: assets/zero-icon.png
const APP_ICON = 'ícone.png'; // substitui pelo teu ícone

const defaults = { name:'', bio:'', photo:'', photoZoom:1, photoX:50, photoY:50, theme:'dark', lang:'pt', appIcon:'' };
const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
let profile = { ...defaults, ...readJSON('zero-profile', {}) };
let projects = Array.isArray(readJSON('zero-projects', [])) ? readJSON('zero-projects', []) : [];
let activity = Array.isArray(readJSON('zero-activity', [])) ? readJSON('zero-activity', []) : [];
let active = 'home';

const t = {
  pt:{home:'Início',projects:'Projetos',activity:'Atividade',profile:'Perfil',greeting:'Transforma ideias em realidade.',prompt:'O que vais criar hoje?',hint:'Nome do projeto...',startProject:'Começar projeto',empty:'Ainda não tens projetos.',emptySub:'A tua próxima grande ideia pode começar aqui.',newProject:'Novo projeto',name:'Nome',bio:'Bio',language:'Idioma',save:'Guardar alterações',choosePhoto:'Carregar foto',created:'Projeto criado',profileSaved:'Perfil atualizado',noActivity:'Ainda não há atividade.',back:'Voltar',next:'Próximo passo',begin:'Começar agora',types:['App','Negócio','Produto','Jogo','Outro'],camera:'Carregar foto',adjust:'Ajustar foto',zoom:'Zoom',savePhoto:'Guardar foto',cancel:'Cancelar',projectType:'Tipo de projeto',idea:'Ideia',plan:'Plano',create:'Criar',launch:'Lançar',step1:'Define claramente o que queres criar.',step2:'Transforma a ideia num plano simples.',step3:'Constrói a primeira versão.',step4:'Prepara o projeto para chegar ao mundo.',firstStep:'Começa por definir o objetivo do projeto.',continue:'Continuar',themeLight:'Modo claro',themeDark:'Modo escuro',emptyActivity:'Quando começares a criar, a tua atividade aparecerá aqui.',profileHint:'Adiciona o teu nome e uma breve bio.',appIcon:'Ícone da app',deleteProject:'Eliminar projeto',deleteConfirm:'Tens a certeza que queres eliminar este projeto?',deleted:'Projeto eliminado'},
  en:{home:'Home',projects:'Projects',activity:'Activity',profile:'Profile',greeting:'Turn ideas into reality.',prompt:'What will you create today?',hint:'Describe your idea...',startProject:'Start project',empty:'You have no projects yet.',emptySub:'Your next big idea can start here.',newProject:'New project',name:'Name',bio:'Bio',language:'Language',save:'Save changes',choosePhoto:'Upload photo',created:'Project created',profileSaved:'Profile updated',noActivity:'No activity yet.',back:'Back',next:'Next step',begin:'Start now',types:['App','Business','Product','Game','Other'],camera:'Upload photo',adjust:'Adjust photo',zoom:'Zoom',savePhoto:'Save photo',cancel:'Cancel',projectType:'Project type',idea:'Idea',plan:'Plan',create:'Create',launch:'Launch',step1:'Clearly define what you want to create.',step2:'Turn the idea into a simple plan.',step3:'Build the first version.',step4:'Prepare the project to reach the world.',firstStep:'Start by defining the project goal.',continue:'Continue',themeLight:'Light mode',themeDark:'Dark mode',emptyActivity:'Once you start creating, your activity will appear here.',profileHint:'Add your name and a short bio.',appIcon:'App icon',deleteProject:'Delete project',deleteConfirm:'Are you sure you want to delete this project?',deleted:'Project deleted'},
  fr:{home:'Accueil',projects:'Projets',activity:'Activité',profile:'Profil',greeting:'Transforme tes idées en réalité.',prompt:'Que vas-tu créer aujourd’hui ?',hint:'Décris ton idée...',startProject:'Commencer le projet',empty:'Tu n’as encore aucun projet.',emptySub:'Ton prochain grand projet peut commencer ici.',newProject:'Nouveau projet',name:'Nom',bio:'Bio',language:'Langue',save:'Enregistrer les modifications',choosePhoto:'Charger une photo',created:'Projet créé',profileSaved:'Profil mis à jour',noActivity:'Aucune activité pour le moment.',back:'Retour',next:'Prochaine étape',begin:'Commencer',types:['App','Entreprise','Produit','Jeu','Autre'],camera:'Charger une photo',adjust:'Ajuster la photo',zoom:'Zoom',savePhoto:'Enregistrer la photo',cancel:'Annuler',projectType:'Type de projet',idea:'Idée',plan:'Plan',create:'Créer',launch:'Lancer',step1:'Définis clairement ce que tu veux créer.',step2:'Transforme ton idée en un plan simple.',step3:'Construis la première version.',step4:'Prépare le projet pour le monde.',firstStep:'Commence par définir l’objectif du projet.',continue:'Continuer',themeLight:'Mode clair',themeDark:'Mode sombre',emptyActivity:'Ton activité apparaîtra ici lorsque tu commenceras à créer.',profileHint:'Ajoute ton nom et une courte bio.',appIcon:'Icône de l’app',deleteProject:'Supprimer le projet',deleteConfirm:'Es-tu sûr de vouloir supprimer ce projet ?',deleted:'Projet supprimé'}
};
const L = () => t[profile.lang] || t.pt;

function save(){
  localStorage.setItem('zero-profile', JSON.stringify(profile));
  localStorage.setItem('zero-projects', JSON.stringify(projects));
  localStorage.setItem('zero-activity', JSON.stringify(activity));
  document.documentElement.lang = profile.lang;
  document.body.dataset.theme = profile.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', profile.theme==='light' ? '#ffffff' : '#070b12');
}
function toast(msg){const x=document.querySelector('.toast');if(!x)return;x.textContent=msg;x.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>x.classList.remove('show'),2200)}
function initials(){const n=(profile.name||'').trim();return n?n.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase():'Z'}
function appIconMarkup(){return `<img class="app-icon-img" src="${APP_ICON}" alt="ZERO" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="app-icon-placeholder">Z</span>`}
function avatar(size='small'){return profile.photo?`<span class="avatar-wrap ${size}"><img class="avatar-img" src="${profile.photo}" alt="" style="object-position:${profile.photoX||50}% ${profile.photoY||50}%;transform:scale(${profile.photoZoom||1})"></span>`:`<span class="avatar-letter ${size}">${initials()}</span>`}
function homePrompt(){ const l=L(); const n=escapeHtml(profile.name.trim()); if(!n) return l.prompt; if(profile.lang==='fr') return `${l.prompt.replace(/\s*\?$/, '')}, ${n} ?`; return `${l.prompt.replace(/\s*\?$/, '')}, ${n}?`; }
function navButton(id,icon,label){return `<button class="nav-item ${active===id?'active':''}" onclick="nav('${id}')"><span class="nav-icon">${icon}</span><span>${label}</span></button>`}
function shell(content,{hideNav=false}={}){
  const l=L();
  app.innerHTML=`<div class="app-shell"><div class="toast"></div><div class="view">${content}</div>${hideNav?'':`<nav class="bottom-nav">${navButton('home','⌂',l.home)}${navButton('projects','◇',l.projects)}<button class="create-fab" onclick="focusIdea()" aria-label="${l.startProject}">＋</button>${navButton('activity','◷',l.activity)}${navButton('profile','◯',l.profile)}</nav>`}</div>`;
}

function home(){
  const l=L();
  shell(`<main class="page home-page"><header class="topbar"><div class="app-icon-trigger" aria-label="ZERO" title="ZERO">${appIconMarkup()}</div><div class="home-actions"><button class="theme-toggle ${profile.theme==='light'?'is-light':''}" onclick="toggleTheme()" aria-label="${profile.theme==='light'?l.themeDark:l.themeLight}" title="${profile.theme==='light'?l.themeDark:l.themeLight}"><span class="theme-icon">${profile.theme==='light'?'☀':'☾'}</span></button><button class="profile-trigger" onclick="nav('profile')">${avatar()}</button></div></header><section class="home-center"><div class="micro">ZERO</div><h1>${homePrompt()}</h1><p>${l.greeting}</p><div class="idea-input-wrap"><input id="homeIdea" class="idea-input" placeholder="${l.hint}" autocomplete="off" onkeydown="if(event.key==='Enter') startProjectFromHome()"><button class="idea-start" onclick="startProjectFromHome()" aria-label="${l.startProject}" title="${l.startProject}"><span>↑</span></button></div></section><footer class="home-footer"><span>ZERO</span><span>© 2026</span></footer></main>`);
}

function validProjects(){return projects.filter(p=>p&&typeof p.name==='string'&&p.name.trim())}
function projectsPage(){
  const l=L(), list=validProjects();
  const cards=list.length?list.map(p=>`<button class="project-card" onclick="openProject(${projects.indexOf(p)})"><div class="project-mark">${symbolFor(p.type)}</div><div class="project-copy"><span>${escapeHtml(p.type||'Projeto')}</span><h3>${escapeHtml(p.name)}</h3><div class="project-meta"><i><em style="width:${Number(p.progress)||0}%"></em></i><b>${Number(p.progress)||0}%</b></div></div><span class="arrow">↗</span></button>`).join(''):`<div class="empty-state"><div class="empty-orbit">✦</div><h2>${l.empty}</h2><p>${l.emptySub}</p><button class="text-action" onclick="focusIdea()">+ ${l.startProject}</button></div>`;
  shell(`<main class="page inner-page"><header class="page-head"><div><div class="micro">ZERO</div><h1>${l.projects}</h1></div><button class="round-action" onclick="focusIdea()">＋</button></header><section class="project-list">${cards}</section></main>`);
}
function activityPage(){
  const l=L(), items=activity.length?activity.slice().reverse().map(a=>`<div class="activity-row"><div class="activity-dot">${a.icon||'✦'}</div><div><b>${escapeHtml(a.title||'')}</b><span>${escapeHtml(a.time||'')}</span></div></div>`).join(''):`<div class="empty-state compact"><div class="empty-orbit">◷</div><h2>${l.noActivity}</h2><p>${l.emptyActivity}</p></div>`;
  shell(`<main class="page inner-page"><header class="page-head"><div><div class="micro">ZERO</div><h1>${l.activity}</h1></div></header><section class="activity-list">${items}</section></main>`);
}
function profilePage(){
  const l=L();
  shell(`<main class="page profile-page"><section class="profile-edit-screen"><div class="profile-edit-top"><button class="profile-back" onclick="nav('home')" aria-label="${l.back}">←</button><div class="micro">ZERO</div><div></div></div><div class="profile-form"><div class="profile-upload"><div class="profile-photo profile-photo-large">${avatar('large')}</div><button class="camera-button" onclick="document.querySelector('#profilePhotoInput').click()" aria-label="${l.camera}">⌕</button><input id="profilePhotoInput" type="file" accept="image/*" onchange="readProfilePhoto(this)"></div><label>${l.name}</label><input id="profileNameDirect" value="${escapeAttr(profile.name)}" placeholder="${l.name}"><label>${l.bio}</label><textarea id="profileBioDirect" maxlength="140" placeholder="${l.bio}">${escapeHtml(profile.bio||'')}</textarea><label>${l.language}</label><select id="profileLangDirect" onchange="changeLanguage(this.value)"><option value="pt" ${profile.lang==='pt'?'selected':''}>Português</option><option value="fr" ${profile.lang==='fr'?'selected':''}>Français</option><option value="en" ${profile.lang==='en'?'selected':''}>English</option></select><button class="save-profile" onclick="saveDirectProfile()">${l.save}<span>→</span></button></div></section></main>`,{hideNav:true});
}

function render(){save();({home,projects:projectsPage,activity:activityPage,profile:profilePage}[active]||home)()}
function nav(n){active=n;render()}
function focusIdea(){if(active!=='home'){active='home';render();setTimeout(()=>document.querySelector('#homeIdea')?.focus(),80)}else document.querySelector('#homeIdea')?.focus()}
async function startProjectFromHome(){
  const input=document.querySelector('#homeIdea'); const idea=input?.value.trim(); if(!idea){input?.focus();return;}
  const button=document.querySelector('.idea-start'); if(button){button.disabled=true;button.innerHTML='<span class="spinner"></span>'}
  let plan=null;
  try{
    const res=await fetch('/api/groq/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idea,lang:profile.lang})});
    if(res.ok) plan=await res.json();
  }catch(e){/* local fallback keeps the app usable without the AI server */}
  const fallbackStages=[
    {title:L().idea,description:L().step1,question:L().firstStep},
    {title:L().plan,description:L().step2,question:profile.lang==='en'?'What should the solution do first?':profile.lang==='fr'?'Que doit faire la solution en premier ?':'O que a solução deve fazer primeiro?'},
    {title:L().create,description:L().step3,question:profile.lang==='en'?'What is the first version you can actually build?':profile.lang==='fr'?'Quelle est la première version que tu peux réellement construire ?':'Qual é a primeira versão que consegues realmente construir?'},
    {title:L().launch,description:L().step4,question:profile.lang==='en'?'Who should use it first and how will you launch it?':profile.lang==='fr'?'Qui devrait l’utiliser en premier et comment vas-tu la lancer ?':'Quem deve usar isto primeiro e como vais lançar?'}
  ];
  const project={
    name:plan?.name||idea.slice(0,54), idea, type:plan?.type||'Outro', progress:0, created:new Date().toISOString(), step:0,
    stages:Array.isArray(plan?.stages)&&plan.stages.length?plan.stages.map((x,i)=>({...fallbackStages[i],...x})):fallbackStages,
    answers:[], aiReady:!!plan
  };
  projects.push(project);
  activity.push({title:`${L().created}: ${project.name}`,time:new Date().toLocaleString(),icon:'✦'});
  save(); active='projects'; projectsPage(); toast(L().created); setTimeout(()=>openProject(projects.length-1),80);
}
function renderProjectStages(p){
  const l=L(); const fallback=[l.idea,l.plan,l.create,l.launch];
  return (p.stages||[]).map((st,n)=>`<button class="step ${n===Number(p.step)?'current':''} ${n<Number(p.step)?'done':''}" onclick="setProjectStep(${projects.indexOf(p)},${n})"><span>0${n+1}</span><div><b>${escapeHtml(st.title||fallback[n]||'Etapa')}</b><small>${escapeHtml(st.description||'')}</small></div><em>${n<Number(p.step)?'✓':n===Number(p.step)?'→':''}</em></button>`).join('');
}
function openProject(i){
  const p=projects[i]; if(!p||!p.name)return; const l=L(); const current=Math.min(Number(p.step)||0,3); const stage=p.stages?.[current]||{};
  document.body.insertAdjacentHTML('beforeend',`<div class="overlay project-overlay" id="projectOverlay"><div class="project-detail"><div class="detail-head"><button class="detail-back" onclick="document.querySelector('#projectOverlay')?.remove()">← ${l.back}</button><div class="detail-actions"><button class="delete-project" onclick="deleteProject(${i})" aria-label="${l.deleteProject}" title="${l.deleteProject}">⌫</button><button class="detail-close" onclick="document.querySelector('#projectOverlay')?.remove()">×</button></div></div><div class="detail-symbol">${symbolFor(p.type)}</div><div class="micro">${escapeHtml(p.type||l.newProject)}</div><h2>${escapeHtml(p.name)}</h2><p>${escapeHtml(p.idea||'')}</p><div class="steps">${renderProjectStages(p)}</div><div class="detail-progress"><div style="width:${current/3*100}%"></div></div><section class="coach"><div class="micro">ZERO COACH</div><h3>${escapeHtml(stage.title||l.idea)}</h3><p>${escapeHtml(stage.question||l.firstStep)}</p><textarea id="coachAnswer" placeholder="${profile.lang==='en'?'Write your answer...':profile.lang==='fr'?'Écris ta réponse...':'Escreve a tua resposta...'}">${escapeHtml(p.answers?.[current]||'')}</textarea><button class="next-step" onclick="submitCoach(${i})"><span>${current>=3?l.launch:l.next}</span><b>${current>=3?l.begin:l.continue} →</b></button></section></div></div>`);
}
async function submitCoach(i){
  const p=projects[i]; if(!p)return; const current=Math.min(Number(p.step)||0,3); const answer=document.querySelector('#coachAnswer')?.value.trim(); if(!answer){document.querySelector('#coachAnswer')?.focus();return;}
  p.answers=p.answers||[]; p.answers[current]=answer;
  const btn=document.querySelector('.next-step'); if(btn){btn.disabled=true;btn.querySelector('b').textContent='…'}
  try{
    const res=await fetch('/api/groq/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idea:p.idea,name:p.name,type:p.type,stages:p.stages,answers:p.answers,step:current,lang:profile.lang})});
    if(res.ok){const data=await res.json(); if(data.stage){p.stages[current]={...(p.stages[current]||{}),...data.stage};} if(data.nextStage && current<3){p.stages[current+1]={...(p.stages[current+1]||{}),...data.nextStage};}}
  }catch(e){/* fallback still advances */}
  p.step=Math.min(current+1,3); p.progress=Math.round((p.step/3)*100); activity.push({title:`${p.name} · ${p.stages?.[current]?.title||L().idea}`,time:new Date().toLocaleString(),icon:'✓'}); save(); document.querySelector('#projectOverlay')?.remove(); openProject(i);
}
function symbolFor(type){return type==='App'?'◈':type==='Jogo'||type==='Game'?'△':type==='Negócio'||type==='Business'||type==='Entreprise'?'◉':'✦'}

function readProfilePhoto(input){
  const f=input.files?.[0]; if(!f)return;
  if(f.size>8*1024*1024){toast('Image too large');return}
  const r=new FileReader(); r.onload=()=>{profile.photo=r.result;profile.photoZoom=1;profile.photoX=50;profile.photoY=50;save();openPhotoAdjust()};r.readAsDataURL(f)
}
function openPhotoAdjust(){
  if(!profile.photo){document.querySelector('#profilePhotoInput')?.click();return}
  const l=L(); document.body.insertAdjacentHTML('beforeend',`<div class="overlay photo-overlay" id="photoOverlay"><div class="photo-editor"><div class="editor-head"><div><div class="micro">ZERO</div><h2>${l.adjust}</h2></div><button class="detail-close" onclick="document.querySelector('#photoOverlay')?.remove()">×</button></div><div class="crop-stage"><div class="crop-circle crop-drag" id="cropDrag"><img id="cropPreview" src="${profile.photo}" alt="" style="object-position:${profile.photoX||50}% ${profile.photoY||50}%;transform:scale(${profile.photoZoom||1})"></div></div><p class="drag-hint">${profile.lang==='fr'?'Fais glisser la photo pour la positionner.':profile.lang==='en'?'Drag the photo to position it.':'Arrasta a foto para a posicionar.'}</p><label>${l.zoom}</label><input id="photoZoomRange" class="range" type="range" min="1" max="2.5" step="0.01" value="${profile.photoZoom||1}" oninput="updateCrop()"><div class="editor-actions"><button class="secondary" onclick="document.querySelector('#photoOverlay')?.remove()">${l.cancel}</button><button class="primary" onclick="savePhotoAdjust()">${l.savePhoto} <span>→</span></button></div></div></div>`);
  initPhotoDrag();
}
function updateCrop(){const img=document.querySelector('#cropPreview');if(!img)return;const z=document.querySelector('#photoZoomRange').value;img.style.transform=`scale(${z})`;img.style.objectPosition=`${profile.photoX||50}% ${profile.photoY||50}%`}
function initPhotoDrag(){
  const stage=document.querySelector('#cropDrag'); if(!stage)return;
  let dragging=false,startX=0,startY=0,startPX=profile.photoX||50,startPY=profile.photoY||50;
  const move=(x,y)=>{if(!dragging)return;const dx=x-startX,dy=y-startY;profile.photoX=Math.max(0,Math.min(100,startPX-dx/stage.clientWidth*100));profile.photoY=Math.max(0,Math.min(100,startPY-dy/stage.clientHeight*100));updateCrop()};
  stage.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startY=e.clientY;startPX=profile.photoX||50;startPY=profile.photoY||50;stage.setPointerCapture(e.pointerId)});
  stage.addEventListener('pointermove',e=>move(e.clientX,e.clientY));
  stage.addEventListener('pointerup',()=>dragging=false); stage.addEventListener('pointercancel',()=>dragging=false);
}
function savePhotoAdjust(){profile.photoZoom=Number(document.querySelector('#photoZoomRange')?.value||1);save();document.querySelector('#photoOverlay')?.remove();profilePage();toast(L().profileSaved)}
function saveDirectProfile(){profile.name=document.querySelector('#profileNameDirect')?.value.trim()||'';profile.bio=document.querySelector('#profileBioDirect')?.value.trim()||'';profile.lang=document.querySelector('#profileLangDirect')?.value||'pt';save();render();toast(L().profileSaved)}
function changeLanguage(lang){profile.lang=lang;save();profilePage()}
function toggleTheme(){profile.theme=profile.theme==='dark'?'light':'dark';save();render()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escapeAttr(s){return escapeHtml(s).replace(/`/g,'&#96;')}

render();
