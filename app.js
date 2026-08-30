const app = document.querySelector('#app');

// COLOCA AQUI O CAMINHO DO ÍCONE DA APP.
// Ex.: assets/zero-icon.png
const APP_ICON = 'ícone.png';

const defaults = {
  name: '',
  bio: '',
  photo: '',
  photoZoom: 1,
  photoX: 50,
  photoY: 50,
  theme: 'dark',
  lang: 'pt',
  appIcon: ''
};

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(
      localStorage.getItem(key) || JSON.stringify(fallback)
    );
  } catch {
    return fallback;
  }
};

let profile = {
  ...defaults,
  ...readJSON('zero-profile', {})
};

let projects = Array.isArray(readJSON('zero-projects', []))
  ? readJSON('zero-projects', [])
  : [];

let activity = Array.isArray(readJSON('zero-activity', []))
  ? readJSON('zero-activity', [])
  : [];

let active = 'home';

const t = {
  pt: {
    home: 'Início',
    projects: 'Projetos',
    activity: 'Atividade',
    profile: 'Perfil',

    greeting: 'Transforma ideias em realidade.',
    prompt: 'O que vais criar hoje?',
    hint: 'Descreve a tua ideia em poucas palavras...',
    startProject: 'Começar projeto',

    empty: 'Ainda não tens projetos.',
    emptySub: 'A tua próxima grande ideia pode começar aqui.',

    newProject: 'Novo projeto',
    name: 'Nome',
    bio: 'Bio',
    language: 'Idioma',
    save: 'Guardar alterações',

    choosePhoto: 'Carregar foto',
    created: 'Projeto criado',
    profileSaved: 'Perfil atualizado',

    noActivity: 'Ainda não há atividade.',
    back: 'Voltar',

    next: 'Próximo passo',
    begin: 'Começar agora',

    types: ['App', 'Negócio', 'Produto', 'Jogo', 'Outro'],

    camera: 'Carregar foto',
    adjust: 'Ajustar foto',
    zoom: 'Zoom',
    savePhoto: 'Guardar foto',
    cancel: 'Cancelar',

    projectType: 'Tipo de projeto',

    idea: 'Ideia',
    plan: 'Plano',
    create: 'Criar',
    launch: 'Lançar',

    step1: 'Define claramente o que queres criar.',
    step2: 'Transforma a ideia num plano simples.',
    step3: 'Constrói a primeira versão.',
    step4: 'Prepara o projeto para chegar ao mundo.',

    firstStep: 'Começa por definir o objetivo do projeto.',
    continue: 'Continuar',

    themeLight: 'Modo claro',
    themeDark: 'Modo escuro',

    emptyActivity:
      'Quando começares a criar, a tua atividade aparecerá aqui.',

    profileHint: 'Adiciona o teu nome e uma breve bio.',
    appIcon: 'Ícone da app',

    deleteProject: 'Eliminar projeto',
    deleteConfirm:
      'Tens a certeza que queres eliminar este projeto?',

    deleted: 'Projeto eliminado',

    clearActivity: 'Limpar atividade',
    clearActivityConfirm:
      'Tens a certeza que queres limpar toda a atividade?',
    activityCleared: 'Atividade limpa',

    deleteData: 'Eliminar todos os dados',
    deleteDataConfirm:
      'Tens a certeza que queres eliminar todos os teus dados? Esta ação não pode ser desfeita.',
    dataDeleted: 'Todos os dados foram eliminados.'
  },

  en: {
    home: 'Home',
    projects: 'Projects',
    activity: 'Activity',
    profile: 'Profile',

    greeting: 'Turn ideas into reality.',
    prompt: 'What will you create today?',
    hint: 'Describe your idea in a few words...',
    startProject: 'Start project',

    empty: 'You have no projects yet.',
    emptySub: 'Your next big idea can start here.',

    newProject: 'New project',
    name: 'Name',
    bio: 'Bio',
    language: 'Language',
    save: 'Save changes',

    choosePhoto: 'Upload photo',
    created: 'Project created',
    profileSaved: 'Profile updated',

    noActivity: 'No activity yet.',
    back: 'Back',

    next: 'Next step',
    begin: 'Start now',

    types: ['App', 'Business', 'Product', 'Game', 'Other'],

    camera: 'Upload photo',
    adjust: 'Adjust photo',
    zoom: 'Zoom',
    savePhoto: 'Save photo',
    cancel: 'Cancel',

    projectType: 'Project type',

    idea: 'Idea',
    plan: 'Plan',
    create: 'Create',
    launch: 'Launch',

    step1: 'Clearly define what you want to create.',
    step2: 'Turn the idea into a simple plan.',
    step3: 'Build the first version.',
    step4: 'Prepare the project to reach the world.',

    firstStep: 'Start by defining the project goal.',
    continue: 'Continue',

    themeLight: 'Light mode',
    themeDark: 'Dark mode',

    emptyActivity:
      'Once you start creating, your activity will appear here.',

    profileHint: 'Add your name and a short bio.',
    appIcon: 'App icon',

    deleteProject: 'Delete project',
    deleteConfirm:
      'Are you sure you want to delete this project?',

    deleted: 'Project deleted',

    clearActivity: 'Clear activity',
    clearActivityConfirm:
      'Are you sure you want to clear all activity?',
    activityCleared: 'Activity cleared',

    deleteData: 'Delete all data',
    deleteDataConfirm:
      'Are you sure you want to delete all your data? This cannot be undone.',
    dataDeleted: 'All data has been deleted.'
  },

  fr: {
    home: 'Accueil',
    projects: 'Projets',
    activity: 'Activité',
    profile: 'Profil',

    greeting: 'Transforme tes idées en réalité.',
    prompt: 'Que vas-tu créer aujourd’hui ?',
    hint: 'Décris ton idée en quelques mots...',
    startProject: 'Commencer le projet',

    empty: 'Tu n’as encore aucun projet.',
    emptySub:
      'Ton prochain grand projet peut commencer ici.',

    newProject: 'Nouveau projet',
    name: 'Nom',
    bio: 'Bio',
    language: 'Langue',
    save: 'Enregistrer les modifications',

    choosePhoto: 'Charger une photo',
    created: 'Projet créé',
    profileSaved: 'Profil mis à jour',

    noActivity: 'Aucune activité pour le moment.',
    back: 'Retour',

    next: 'Prochaine étape',
    begin: 'Commencer',

    types: [
      'App',
      'Entreprise',
      'Produit',
      'Jeu',
      'Autre'
    ],

    camera: 'Charger une photo',
    adjust: 'Ajuster la photo',
    zoom: 'Zoom',
    savePhoto: 'Enregistrer la photo',
    cancel: 'Annuler',

    projectType: 'Type de projet',

    idea: 'Idée',
    plan: 'Plan',
    create: 'Créer',
    launch: 'Lancer',

    step1:
      'Définis clairement ce que tu veux créer.',
    step2:
      'Transforme ton idée en un plan simple.',
    step3:
      'Construis la première version.',
    step4:
      'Prépare le projet pour le monde.',

    firstStep:
      'Commence par définir l’objectif du projet.',
    continue: 'Continuer',

    themeLight: 'Mode clair',
    themeDark: 'Mode sombre',

    emptyActivity:
      'Ton activité apparaîtra ici lorsque tu commenceras à créer.',

    profileHint:
      'Ajoute ton nom et une courte bio.',
    appIcon: 'Icône de l’app',

    deleteProject: 'Supprimer le projet',
    deleteConfirm:
      'Es-tu sûr de vouloir supprimer ce projet ?',

    deleted: 'Projet supprimé',

    clearActivity: 'Effacer l’activité',
    clearActivityConfirm:
      'Es-tu sûr de vouloir effacer toute l’activité ?',
    activityCleared: 'Activité effacée',

    deleteData: 'Supprimer toutes les données',
    deleteDataConfirm:
      'Es-tu sûr de vouloir supprimer toutes tes données ? Cette action est irréversible.',
    dataDeleted: 'Toutes les données ont été supprimées.'
  }
};

const L = () => t[profile.lang] || t.pt;

function save() {
  localStorage.setItem(
    'zero-profile',
    JSON.stringify(profile)
  );

  localStorage.setItem(
    'zero-projects',
    JSON.stringify(projects)
  );

  localStorage.setItem(
    'zero-activity',
    JSON.stringify(activity)
  );

  document.documentElement.lang = profile.lang;

  document.body.dataset.theme = profile.theme;

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute(
      'content',
      profile.theme === 'light'
        ? '#ffffff'
        : '#070b12'
    );
}

function toast(msg) {
  const x = document.querySelector('.toast');

  if (!x) return;

  x.textContent = msg;

  x.classList.add('show');

  clearTimeout(window.__toast);

  window.__toast = setTimeout(() => {
    x.classList.remove('show');
  }, 2200);
}

function initials() {
  const n = (profile.name || '').trim();

  return n
    ? n
        .split(/\s+/)
        .slice(0, 2)
        .map(x => x[0])
        .join('')
        .toUpperCase()
    : 'Z';
}

function appIconMarkup() {
  return `
    <img
      class="app-icon-img"
      src="${APP_ICON}"
      alt="ZERO"
      onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"
    >
    <span class="app-icon-placeholder">Z</span>
  `;
}

function avatar(size = 'small') {
  return profile.photo
    ? `
      <span class="avatar-wrap ${size}">
        <img
          class="avatar-img"
          src="${profile.photo}"
          alt=""
          style="
            object-position:
              ${profile.photoX || 50}%
              ${profile.photoY || 50}%;
            transform:
              scale(${profile.photoZoom || 1});
          "
        >
      </span>
    `
    : `
      <span class="avatar-letter ${size}">
        ${initials()}
      </span>
    `;
}

function homePrompt() {
  const l = L();

  const n = escapeHtml(
    profile.name.trim()
  );

  if (!n) {
    return l.prompt;
  }

  if (profile.lang === 'fr') {
    return `${l.prompt.replace(/\s*\?$/, '')}, ${n} ?`;
  }

  return `${l.prompt.replace(/\s*\?$/, '')}, ${n}?`;
}

function navButton(id, icon, label) {
  return `
    <button
      class="nav-item ${active === id ? 'active' : ''}"
      onclick="nav('${id}')"
    >
      <span class="nav-icon">${icon}</span>
      <span>${label}</span>
    </button>
  `;
}

function shell(content, { hideNav = false } = {}) {
  const l = L();

  app.innerHTML = `
    <div class="app-shell">

      <div class="toast"></div>

      <div class="view">
        ${content}
      </div>

      ${
        hideNav
          ? ''
          : `
            <nav class="bottom-nav">

              ${navButton(
                'home',
                '⌂',
                l.home
              )}

              ${navButton(
                'projects',
                '◇',
                l.projects
              )}

              <button
                class="create-fab"
                onclick="focusIdea()"
                aria-label="${l.startProject}"
              >
                ＋
              </button>

              ${navButton(
                'activity',
                '◷',
                l.activity
              )}

              ${navButton(
                'profile',
                '◯',
                l.profile
              )}

            </nav>
          `
      }

    </div>
  `;
}

function home() {
  const l = L();

  shell(`
    <main class="page home-page">

      <header class="topbar">

        <div
          class="app-icon-trigger"
          aria-label="ZERO"
          title="ZERO"
        >
          ${appIconMarkup()}
        </div>

        <div class="home-actions">

          <button
            class="theme-toggle ${
              profile.theme === 'light'
                ? 'is-light'
                : ''
            }"
            onclick="toggleTheme()"
            aria-label="${
              profile.theme === 'light'
                ? l.themeDark
                : l.themeLight
            }"
            title="${
              profile.theme === 'light'
                ? l.themeDark
                : l.themeLight
            }"
          >
            <span class="theme-icon">
              ${
                profile.theme === 'light'
                  ? '☀'
                  : '☾'
              }
            </span>
          </button>

          <button
            class="profile-trigger"
            onclick="nav('profile')"
          >
            ${avatar()}
          </button>

        </div>

      </header>

      <section class="home-center">

        <div class="micro">
          ZERO
        </div>

        <h1>
          ${homePrompt()}
        </h1>

        <p>
          ${l.greeting}
        </p>

        <div class="idea-input-wrap">

          <input
            id="homeIdea"
            class="idea-input"
            placeholder="${l.hint}"
            autocomplete="off"
            onkeydown="
              if(event.key==='Enter')
              startProjectFromHome()
            "
          >

          <button
            class="idea-start"
            onclick="startProjectFromHome()"
            aria-label="${l.startProject}"
            title="${l.startProject}"
          >
            <span>↑</span>
          </button>

        </div>

      </section>

      <footer class="home-footer">
        
      </footer>

    </main>
  `);
}

function validProjects() {
  return projects.filter(
    p =>
      p &&
      typeof p.name === 'string' &&
      p.name.trim()
  );
}

function projectsPage() {
  const l = L();

  const list = validProjects();

  const cards = list.length
    ? list
        .map(
          p => `
            <div
              class="project-card"
              role="button"
              tabindex="0"
              onclick="
                openProject(
                  ${projects.indexOf(p)}
                )
              "
              onkeydown="
                if(event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openProject(${projects.indexOf(p)});
                }
              "
            >

              <button
                class="project-delete"
                type="button"
                onclick="event.stopPropagation(); deleteProject(${projects.indexOf(p)})"
                aria-label="${l.deleteProject}"
                title="${l.deleteProject}"
              >
                ⌫
              </button>

              <div class="project-mark">
                ${symbolFor(p.type)}
              </div>

              <div class="project-copy">

                <span>
                  ${escapeHtml(
                    p.type || 'Projeto'
                  )}
                </span>

                <h3>
                  ${escapeHtml(p.name)}
                </h3>

                <div class="project-meta">

                  <i>
                    <em
                      style="
                        width:${
                          Number(p.progress) || 0
                        }%
                      "
                    ></em>
                  </i>

                  <b>
                    ${
                      Number(p.progress) || 0
                    }%
                  </b>

                </div>

              </div>

              <span class="arrow">
                ↗
              </span>

            </div>
          `
        )
        .join('')
    : `
      <div class="empty-state">

        <div class="empty-orbit">
          ✦
        </div>

        <h2>
          ${l.empty}
        </h2>

        <p>
          ${l.emptySub}
        </p>

        <button
          class="text-action"
          onclick="focusIdea()"
        >
          + ${l.startProject}
        </button>

      </div>
    `;

  shell(`
    <main class="page inner-page">

      <header class="page-head">

        <div>

          <div class="micro">
            ZERO
          </div>

          <h1>
            ${l.projects}
          </h1>

        </div>

        <button
          class="round-action"
          onclick="focusIdea()"
        >
          ＋
        </button>

      </header>

      <section class="project-list">
        ${cards}
      </section>

    </main>
  `);
}

function activityPage() {
  const l = L();

  const items = activity.length
    ? activity
        .slice()
        .reverse()
        .map(
          a => `
            <div class="activity-row">

              <div class="activity-dot">
                ${a.icon || '✦'}
              </div>

              <div>

                <b>
                  ${escapeHtml(
                    a.title || ''
                  )}
                </b>

                <span>
                  ${escapeHtml(
                    a.time || ''
                  )}
                </span>

              </div>

            </div>
          `
        )
        .join('')
    : `
      <div class="empty-state compact">

        <div class="empty-orbit">
          ◷
        </div>

        <h2>
          ${l.noActivity}
        </h2>

        <p>
          ${l.emptyActivity}
        </p>

      </div>
    `;

  const clearButton = activity.length
    ? `
      <button
        class="clear-activity-btn"
        onclick="clearActivity()"
      >
        ${l.clearActivity}
      </button>
    `
    : '';

  shell(`
    <main class="page inner-page">

      <header class="page-head">

        <div>

          <div class="micro">
            ZERO
          </div>

          <h1>
            ${l.activity}
          </h1>

        </div>

        ${clearButton}

      </header>

      <section class="activity-list">
        ${items}
      </section>

    </main>
  `);
}

function profilePage() {
  const l = L();

  shell(`
    <main class="page profile-page">

      <section class="profile-edit-screen">

        <div class="profile-edit-top">

          <button
            class="profile-back"
            onclick="nav('home')"
            aria-label="${l.back}"
          >
            ←
          </button>

          <div class="micro">
            ZERO
          </div>

          <div></div>

        </div>

        <div class="profile-form">

          <div class="profile-upload">

            <div
              class="
                profile-photo
                profile-photo-large
              "
            >
              ${avatar('large')}
            </div>

            <button
              class="camera-button"
              onclick="
                document
                  .querySelector('#profilePhotoInput')
                  .click()
              "
              aria-label="${l.camera}"
            >
              ⌕
            </button>

            <input
              id="profilePhotoInput"
              type="file"
              accept="image/*"
              onchange="readProfilePhoto(this)"
            >

          </div>

          <label>
            ${l.name}
          </label>

          <input
            id="profileNameDirect"
            value="${escapeAttr(profile.name)}"
            placeholder="${l.name}"
          >

          <label>
            ${l.bio}
          </label>

          <textarea
            id="profileBioDirect"
            maxlength="140"
            placeholder="${l.bio}"
          >${escapeHtml(profile.bio || '')}</textarea>

          <label>
            ${l.language}
          </label>

          <select
            id="profileLangDirect"
            onchange="changeLanguage(this.value)"
          >

            <option
              value="pt"
              ${
                profile.lang === 'pt'
                  ? 'selected'
                  : ''
              }
            >
              Português
            </option>

            <option
              value="fr"
              ${
                profile.lang === 'fr'
                  ? 'selected'
                  : ''
              }
            >
              Français
            </option>

            <option
              value="en"
              ${
                profile.lang === 'en'
                  ? 'selected'
                  : ''
              }
            >
              English
            </option>

          </select>

          <button
            class="save-profile"
            onclick="saveDirectProfile()"
          >
            ${l.save}
            <span>→</span>
          </button>

          <button
            class="delete-data-btn"
            onclick="deleteAllData()"
          >
            ${l.deleteData}
          </button>

        </div>

      </section>

    </main>
  `, {
    hideNav: true
  });
}

function render() {
  save();

  ({
    home,
    projects: projectsPage,
    activity: activityPage,
    profile: profilePage
  }[active] || home)();
}

function nav(n) {
  active = n;
  render();
}

function focusIdea() {
  if (active !== 'home') {
    active = 'home';

    render();

    setTimeout(
      () =>
        document
          .querySelector('#homeIdea')
          ?.focus(),
      80
    );
  } else {
    document
      .querySelector('#homeIdea')
      ?.focus();
  }
}

async function startProjectFromHome() {
  const input = document.querySelector('#homeIdea');
  const idea = input?.value.trim();

  if (!idea) {
    input?.focus();
    return;
  }

  const button = document.querySelector('.idea-start');
  if (button) {
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span>';
  }

  showAnalysisLoading(idea);

  let analysis = null;
  try {
    const res = await fetch('/api/groq/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, lang: profile.lang })
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || 'Analysis failed');
    analysis = payload;
  } catch (e) {
    document.querySelector('#analysisLoading')?.remove();
    if (button) {
      button.disabled = false;
      button.innerHTML = '<span>↑</span>';
    }
    const msg = String(e?.message || '');
    toast(profile.lang === 'en'
      ? `Could not analyze: ${msg || 'check your Groq API.'}`
      : profile.lang === 'fr'
        ? `Impossible d’analyser : ${msg || 'vérifie ton API Groq.'}`
        : `Não foi possível analisar: ${msg || 'verifica a tua API Groq.'}`);
    return;
  }

  document.querySelector('#analysisLoading')?.remove();
  if (button) {
    button.disabled = false;
    button.innerHTML = '<span>↑</span>';
  }

  const now = new Date().toISOString();
  const project = {
    id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: analysis.name || idea.slice(0, 54),
    idea,
    type: analysis.type || 'Outro',
    progress: 10,
    created: now,
    updated: now,
    analysis,
    stages: Array.isArray(analysis.roadmap) && analysis.roadmap.length
      ? analysis.roadmap.slice(0, 4).map((stage, index) => ({
          title: stage?.title || ['Ideia', 'Plano', 'Criar', 'Lançar'][index],
          description: stage?.action || '',
          goal: stage?.action || '',
          deliverable: ''
        }))
      : [
          { title: 'Ideia', description: 'Clarificar o conceito e o problema.', goal: 'Definir o que será criado.', deliverable: '' },
          { title: 'Plano', description: 'Estruturar o MVP.', goal: 'Escolher as prioridades.', deliverable: '' },
          { title: 'Criar', description: 'Construir a primeira versão.', goal: 'Ter um MVP funcional.', deliverable: '' },
          { title: 'Lançar', description: 'Testar com utilizadores.', goal: 'Validar e melhorar.', deliverable: '' }
        ],
    step: 0,
    answers: [],
    aiReady: true
  };

  projects.push(project);
  activity.push({
    title: `${L().created}: ${project.name}`,
    time: new Date().toLocaleString(),
    icon: '✦'
  });

  save();
  active = 'projects';
  projectsPage();
  toast(L().created);

  setTimeout(() => openProject(projects.length - 1), 80);
}

function showAnalysisLoading(idea) {
  document.querySelector('#analysisLoading')?.remove();
  const labels = profile.lang === 'en'
    ? ['Understanding your idea', 'Mapping the market', 'Finding competitors', 'Building your roadmap']
    : profile.lang === 'fr'
      ? ['Comprendre ton idée', 'Analyser le marché', 'Identifier les concurrents', 'Créer ta feuille de route']
      : ['A entender a tua ideia', 'A analisar o mercado', 'A encontrar concorrentes', 'A criar o teu caminho'];

  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay analysis-loading" id="analysisLoading">
      <div class="analysis-loading-card">
        <div class="analysis-orbit"><span></span><b>ZERO</b></div>
        <div class="micro">ZERO AI</div>
        <h2>${profile.lang === 'en' ? 'Turning your idea into a project.' : profile.lang === 'fr' ? 'Transformer ton idée en projet.' : 'A transformar a tua ideia num projeto.'}</h2>
        <p>${escapeHtml(idea)}</p>
        <div class="analysis-tasks">
          ${labels.map((x, i) => `<div class="analysis-task"><i>${i + 1}</i><span>${escapeHtml(x)}</span><em></em></div>`).join('')}
        </div>
        <small>${profile.lang === 'en' ? 'You only gave the idea. ZERO does the heavy work.' : profile.lang === 'fr' ? 'Tu as donné seulement l’idée. ZERO fait le travail.' : 'Tu deste apenas a ideia. A ZERO faz o trabalho pesado.'}</small>
      </div>
    </div>
  `);
}

function renderProjectStages(p) {
  const l = L();

  const fallback = [
    l.idea,
    l.plan,
    l.create,
    l.launch
  ];

  return (p.stages || [])
    .map(
      (st, n) => `
        <button
          class="
            step
            ${
              n === Number(p.step)
                ? 'current'
                : ''
            }
            ${
              n < Number(p.step)
                ? 'done'
                : ''
            }
          "
          onclick="
            setProjectStep(
              ${projects.indexOf(p)},
              ${n}
            )
          "
        >

          <span>
            0${n + 1}
          </span>

          <div>

            <b>
              ${escapeHtml(
                st.title ||
                fallback[n] ||
                'Etapa'
              )}
            </b>

            <small>
              ${escapeHtml(
                st.description || ''
              )}
            </small>

          </div>

          <em>
            ${
              n < Number(p.step)
                ? '✓'
                : n === Number(p.step)
                  ? '→'
                  : ''
            }
          </em>

        </button>
      `
    )
    .join('');
}

function openProject(i) {
  const p = projects[i];
  if (!p || !p.name) return;

  const a = p.analysis || {};
  const l = L();
  const labels = {
    summary: profile.lang === 'en' ? 'Project' : profile.lang === 'fr' ? 'Projet' : 'Projeto',
    problem: profile.lang === 'en' ? 'Problem & opportunity' : profile.lang === 'fr' ? 'Problème & opportunité' : 'Problema & oportunidade',
    audience: profile.lang === 'en' ? 'Audience' : profile.lang === 'fr' ? 'Public' : 'Público',
    solution: profile.lang === 'en' ? 'Solution' : profile.lang === 'fr' ? 'Solution' : 'Solução',
    features: profile.lang === 'en' ? 'Core features' : profile.lang === 'fr' ? 'Fonctionnalités clés' : 'Funcionalidades principais',
    market: profile.lang === 'en' ? 'Market' : profile.lang === 'fr' ? 'Marché' : 'Mercado',
    competitors: profile.lang === 'en' ? 'Competitors' : profile.lang === 'fr' ? 'Concurrents' : 'Concorrência',
    swot: profile.lang === 'en' ? 'SWOT analysis' : profile.lang === 'fr' ? 'Analyse SWOT' : 'Análise FOFA',
    business: profile.lang === 'en' ? 'Business model' : profile.lang === 'fr' ? 'Modèle économique' : 'Modelo de negócio',
    roadmap: profile.lang === 'en' ? 'Roadmap' : profile.lang === 'fr' ? 'Feuille de route' : 'Plano de ação',
    risks: profile.lang === 'en' ? 'Risks' : profile.lang === 'fr' ? 'Risques' : 'Riscos',
    first: profile.lang === 'en' ? 'First move' : profile.lang === 'fr' ? 'Premier pas' : 'Primeiro passo'
  };

  const list = (items, empty='—') => Array.isArray(items) && items.length
    ? `<ul>${items.map(x => `<li>${escapeHtml(typeof x === 'string' ? x : (x.name || x.title || x.text || ''))}</li>`).join('')}</ul>`
    : `<p class="muted-inline">${empty}</p>`;

  const competitors = Array.isArray(a.competitors) ? a.competitors : [];
  const roadmap = Array.isArray(a.roadmap) ? a.roadmap : [];
  const features = Array.isArray(a.coreFeatures) ? a.coreFeatures : [];
  const strengths = Array.isArray(a.swot?.strengths) ? a.swot.strengths : [];
  const weaknesses = Array.isArray(a.swot?.weaknesses) ? a.swot.weaknesses : [];
  const opportunities = Array.isArray(a.swot?.opportunities) ? a.swot.opportunities : [];
  const threats = Array.isArray(a.swot?.threats) ? a.swot.threats : [];

  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay project-overlay" id="projectOverlay">
      <div class="project-detail project-analysis-detail">
        <div class="detail-head">
          <button class="detail-back" onclick="document.querySelector('#projectOverlay')?.remove()">← ${l.back}</button>
          <div class="detail-actions">
            <button class="delete-project" onclick="deleteProject(${i})" aria-label="${l.deleteProject}" title="${l.deleteProject}">⌫</button>
            <button class="detail-close" onclick="document.querySelector('#projectOverlay')?.remove()">×</button>
          </div>
        </div>

        <div class="detail-symbol">${symbolFor(p.type)}</div>
        <div class="micro">${escapeHtml(p.type || labels.summary)}</div>
        <h2>${escapeHtml(p.name)}</h2>
        <p>${escapeHtml(p.idea)}</p>

        <div class="analysis-score-row">
          <div class="analysis-score">
            <strong>${escapeHtml(String(a.viabilityScore ?? '—'))}</strong>
            <span>/100</span>
          </div>
          <div><b>${escapeHtml(a.verdict || (profile.lang === 'en' ? 'Ready to explore' : profile.lang === 'fr' ? 'Prêt à explorer' : 'Pronta para explorar'))}</b><small>${escapeHtml(a.scoreReason || '')}</small></div>
        </div>

        <div class="analysis-grid">
          <section class="analysis-card analysis-wide"><div class="micro">${labels.summary}</div><h3>${escapeHtml(a.concept || '')}</h3><p>${escapeHtml(a.summary || '')}</p></section>
          <section class="analysis-card"><div class="micro">${labels.problem}</div><h3>${escapeHtml(a.problem || '')}</h3><p>${escapeHtml(a.opportunity || '')}</p></section>
          <section class="analysis-card"><div class="micro">${labels.audience}</div><h3>${escapeHtml(a.targetAudience || '')}</h3><p>${escapeHtml(a.audienceNeed || '')}</p></section>
          <section class="analysis-card analysis-wide"><div class="micro">${labels.solution}</div><h3>${escapeHtml(a.solution || '')}</h3><p>${escapeHtml(a.differentiator || '')}</p></section>
          <section class="analysis-card analysis-wide"><div class="micro">${labels.features}</div>${list(features)}</section>

          <section class="analysis-card analysis-wide"><div class="micro">${labels.market}</div><h3>${escapeHtml(a.market?.summary || '')}</h3><div class="metric-row"><span><b>${escapeHtml(a.market?.size || '—')}</b><small>Mercado</small></span><span><b>${escapeHtml(a.market?.trend || '—')}</b><small>Tendência</small></span><span><b>${escapeHtml(a.market?.entry || '—')}</b><small>Entrada</small></span></div></section>

          <section class="analysis-card analysis-wide"><div class="micro">${labels.competitors}</div><div class="competitor-list">${competitors.length ? competitors.map(c => `<article><div class="competitor-icon">◈</div><div><b>${escapeHtml(c.name || '')}</b><p>${escapeHtml(c.description || '')}</p><small>${escapeHtml(c.weakness || '')}</small></div></article>`).join('') : '<p class="muted-inline">—</p>'}</div></section>

          <section class="analysis-card analysis-wide"><div class="micro">${labels.swot}</div><div class="swot-grid">
            <div><b>S</b><h4>Forças</h4>${list(strengths)}</div>
            <div><b>W</b><h4>Fraquezas</h4>${list(weaknesses)}</div>
            <div><b>O</b><h4>Oportunidades</h4>${list(opportunities)}</div>
            <div><b>T</b><h4>Ameaças</h4>${list(threats)}</div>
          </div></section>

          <section class="analysis-card"><div class="micro">${labels.business}</div><h3>${escapeHtml(a.businessModel?.recommendation || '')}</h3>${list(a.businessModel?.revenueStreams)}</section>
          <section class="analysis-card"><div class="micro">${labels.risks}</div>${list(a.risks)}</section>

          <section class="analysis-card analysis-wide"><div class="micro">${labels.roadmap}</div><div class="roadmap">${roadmap.length ? roadmap.map((r, idx) => `<div class="roadmap-item"><span>0${idx + 1}</span><div><b>${escapeHtml(r.title || '')}</b><p>${escapeHtml(r.action || r.description || '')}</p></div></div>`).join('') : '<p class="muted-inline">—</p>'}</div></section>

          <section class="analysis-card analysis-wide first-move"><div class="micro">${labels.first}</div><h3>${escapeHtml(a.firstMove || '')}</h3><p>${escapeHtml(a.firstMoveWhy || '')}</p></section>
        </div>

        <div class="analysis-footer-note">${escapeHtml(a.disclaimer || (profile.lang === 'en' ? 'Market and competitor insights are AI estimates and should be validated before investment decisions.' : profile.lang === 'fr' ? 'Les informations de marché et de concurrence sont des estimations IA et doivent être validées avant toute décision d’investissement.' : 'As informações de mercado e concorrência são estimativas da IA e devem ser validadas antes de decisões de investimento.'))}</div>

        <section class="zero-next-level-card">
          <div>
            <div class="micro">ZERO · PRÓXIMO NÍVEL</div>
            <h3>${profile.lang === 'en' ? 'Keep building your project' : profile.lang === 'fr' ? 'Continue à construire ton projet' : 'Continua a construir o teu projeto'}</h3>
            <p>${profile.lang === 'en' ? 'ZERO will guide you through the next decisions. You only choose; ZERO does the work.' : profile.lang === 'fr' ? 'ZERO te guide à travers les prochaines décisions. Tu choisis seulement ; ZERO fait le travail.' : 'A ZERO vai guiar-te pelas próximas decisões. Tu só escolhes; a ZERO faz o trabalho.'}</p>
          </div>
          <button class="primary-next-level" onclick="openNextLevel(${i}, ${Number(p.levelStep || 0)})">
            <span>${profile.lang === 'en' ? 'Next level' : profile.lang === 'fr' ? 'Niveau suivant' : 'Passar para o próximo nível'}</span><b>→</b>
          </button>
        </section>
      </div>
    </div>
  `);
}

async function openNextLevel(i, requestedStep) {
  const p = projects[i];
  if (!p) return;

  const step = Math.max(0, Math.min(6, Number(requestedStep ?? p.levelStep ?? 0)));
  p.levelStep = step;
  p.choices = p.choices || {};
  save();

  const labels = profile.lang === 'en'
    ? ['Creating name options…','Finding the best positioning…','Designing your differentiator…','Building your marketing plan…','Choosing a business model…','Preparing the launch…','Building your final plan…']
    : profile.lang === 'fr'
      ? ['Création des noms…','Recherche du positionnement…','Création du différenciateur…','Construction du marketing…','Choix du modèle économique…','Préparation du lancement…','Construction du plan final…']
      : ['A criar opções de nome…','A encontrar o melhor posicionamento…','A criar o teu diferencial…','A montar o plano de marketing…','A escolher o modelo de negócio…','A preparar o lançamento…','A construir o plano final…'];

  document.querySelector('#levelOverlay')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay level-overlay" id="levelOverlay">
      <div class="level-card level-loading-card">
        <div class="analysis-orbit"><span></span><b>ZERO</b></div>
        <div class="micro">NÍVEL ${step + 1} / 7</div>
        <h2>${escapeHtml(labels[step])}</h2>
        <p>${escapeHtml(p.name || p.idea)}</p>
        <div class="level-progress"><span style="width:${Math.round((step / 7) * 100)}%"></span></div>
      </div>
    </div>`);

  try {
    const res = await fetch('/api/groq/level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: p, step, lang: profile.lang })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Não foi possível gerar o próximo nível.');
    renderNextLevel(i, step, data);
  } catch (e) {
    document.querySelector('#levelOverlay')?.remove();
    const wait = /rate limit|tokens per minute|TPM|try again|too many requests/i.test(String(e.message || ''));
    toast(wait
      ? (profile.lang === 'en' ? 'ZERO is taking a short break because the AI limit was reached. Try again in a moment.' : profile.lang === 'fr' ? 'ZERO fait une courte pause car la limite IA a été atteinte. Réessaie dans un instant.' : 'A ZERO fez uma pequena pausa porque o limite da IA foi atingido. Tenta novamente daqui a pouco.')
      : (profile.lang === 'en' ? `Could not load this level: ${e.message}` : profile.lang === 'fr' ? `Impossible de charger ce niveau : ${e.message}` : `Não foi possível carregar este nível: ${e.message}`));
  }
}

function renderNextLevel(i, step, data) {
  const p = projects[i];
  if (!p) return;
  p.levels = p.levels || {};
  p.levels[step] = data;
  save();

  const options = Array.isArray(data.options) ? data.options : [];
  const completed = Object.keys(p.choices || {}).length;
  const isFinal = step >= 6;
  const nextText = profile.lang === 'en' ? 'Continue' : profile.lang === 'fr' ? 'Continuer' : 'Continuar';
  const backText = profile.lang === 'en' ? 'Back to project' : profile.lang === 'fr' ? 'Retour au projet' : 'Voltar ao projeto';
  const chooseText = profile.lang === 'en' ? 'Choose one' : profile.lang === 'fr' ? 'Choisis une option' : 'Escolhe uma opção';

  document.querySelector('#levelOverlay')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="overlay level-overlay" id="levelOverlay">
      <div class="level-card">
        <div class="level-head">
          <button class="detail-back" onclick="document.querySelector('#levelOverlay')?.remove(); openProject(${i})">← ${backText}</button>
          <span class="level-counter">${Math.min(step + 1, 7)} / 7</span>
        </div>
        <div class="level-progress"><span style="width:${Math.round(((step + 1) / 7) * 100)}%"></span></div>
        <div class="micro">ZERO · NÍVEL ${step + 1}</div>
        <h2>${escapeHtml(data.title || '')}</h2>
        <p class="level-message">${escapeHtml(data.message || '')}</p>
        ${isFinal ? `
          <div class="final-plan-card"><div class="micro">ZERO</div><h3>${escapeHtml(data.message || 'Plano concluído.')}</h3><p>${escapeHtml(profile.lang === 'en' ? 'Your choices have been saved to this project.' : profile.lang === 'fr' ? 'Tes choix ont été enregistrés dans ce projet.' : 'As tuas escolhas foram guardadas neste projeto.')}</p></div>
          <button class="primary-next-level level-finish" onclick="finishProjectLevels(${i})"><span>${profile.lang === 'en' ? 'Finish project plan' : profile.lang === 'fr' ? 'Terminer le plan' : 'Concluir plano do projeto'}</span><b>✓</b></button>
        ` : `
          <div class="level-choice-label">${chooseText}</div>
          <div class="level-options">
            ${options.map((o, idx) => `
              <button class="level-option" onclick="chooseLevelOption(${i}, ${step}, '${String(o.id || String.fromCharCode(97 + idx)).replace(/'/g, "\\'")}')">
                <span class="option-number">${String.fromCharCode(65 + idx)}</span>
                <span><b>${escapeHtml(o.title || '')}</b><small>${escapeHtml(o.description || '')}</small></span>
                <em>→</em>
              </button>`).join('')}
          </div>
        `}
        <div class="level-saved">✓ ${escapeHtml(profile.lang === 'en' ? `${completed} decision(s) saved automatically` : profile.lang === 'fr' ? `${completed} décision(s) enregistrée(s) automatiquement` : `${completed} decisão(ões) guardada(s) automaticamente`)}</div>
      </div>
    </div>`);
}

async function chooseLevelOption(i, step, optionId) {
  const p = projects[i];
  if (!p || !p.levels?.[step]) return;
  const option = (p.levels[step].options || []).find(o => String(o.id) === String(optionId));
  if (!option) return;

  p.choices = p.choices || {};
  p.choices[p.levels[step].level || ['name','positioning','differentiator','marketing','business','launch'][step]] = {
    id: option.id,
    title: option.title,
    description: option.description
  };
  p.levelStep = Math.min(step + 1, 6);

  if (step === 0 && option.title) p.name = option.title;
  p.updated = new Date().toISOString();
  p.progress = Math.max(Number(p.progress) || 10, Math.round(((step + 2) / 8) * 100));
  activity.push({ title: `${p.name} · ${p.levels[step].title || 'Nível seguinte'}`, time: new Date().toLocaleString(), icon: '✓' });
  save();

  if (step >= 5) {
    await openNextLevel(i, 6);
  } else {
    await openNextLevel(i, step + 1);
  }
}

function finishProjectLevels(i) {
  const p = projects[i];
  if (!p) return;
  p.levelStep = 7;
  p.progress = 100;
  p.completed = true;
  p.updated = new Date().toISOString();
  save();
  document.querySelector('#levelOverlay')?.remove();
  toast(profile.lang === 'en' ? 'Project plan completed.' : profile.lang === 'fr' ? 'Plan du projet terminé.' : 'Plano do projeto concluído.');
  openProject(i);
}

async function submitCoach(i) {
  const p = projects[i];

  if (!p) return;

  const current =
    Math.min(
      Number(p.step) || 0,
      3
    );

  const answer =
    document
      .querySelector('#coachAnswer')
      ?.value.trim();

  if (!answer) {
    document
      .querySelector('#coachAnswer')
      ?.focus();

    return;
  }

  p.answers =
    p.answers || [];

  p.answers[current] =
    answer;

  const btn =
    document.querySelector(
      '.next-step'
    );

  if (btn) {
    btn.disabled = true;

    btn.querySelector('b')
      .textContent = '…';
  }

  try {
    const res = await fetch(
      '/api/groq/coach',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({
          idea: p.idea,
          name: p.name,
          type: p.type,
          stages: p.stages,
          answers: p.answers,
          step: current,
          lang: profile.lang
        })
      }
    );

    if (res.ok) {
      const data =
        await res.json();

      if (data.stage) {
        p.stages[current] = {
          ...(p.stages[current] || {}),
          ...data.stage
        };
      }

      if (
        data.nextStage &&
        current < 3
      ) {
        p.stages[current + 1] = {
          ...(p.stages[current + 1] || {}),
          ...data.nextStage
        };
      }
    }
  } catch (e) {
    /*
      Mesmo sem IA,
      o projeto continua.
    */
  }

  p.step =
    Math.min(
      current + 1,
      3
    );

  p.progress =
    Math.round(
      (p.step / 3) * 100
    );

  activity.push({
    title:
      `${p.name} · ${
        p.stages?.[current]?.title ||
        L().idea
      }`,

    time:
      new Date().toLocaleString(),

    icon: '✓'
  });

  save();

  document
    .querySelector('#projectOverlay')
    ?.remove();

  openProject(i);
}

function symbolFor(type) {
  return type === 'App'
    ? '◈'
    : type === 'Jogo' ||
      type === 'Game'
      ? '△'
      : type === 'Negócio' ||
        type === 'Business' ||
        type === 'Entreprise'
        ? '◉'
        : '✦';
}

function readProfilePhoto(input) {
  const f =
    input.files?.[0];

  if (!f) return;

  if (
    f.size >
    8 * 1024 * 1024
  ) {
    toast(
      profile.lang === 'pt'
        ? 'Imagem demasiado grande'
        : profile.lang === 'fr'
          ? 'Image trop grande'
          : 'Image too large'
    );

    return;
  }

  const r =
    new FileReader();

  r.onload = () => {
    profile.photo =
      r.result;

    profile.photoZoom = 1;
    profile.photoX = 50;
    profile.photoY = 50;

    save();

    openPhotoAdjust();
  };

  r.readAsDataURL(f);
}

function openPhotoAdjust() {
  if (!profile.photo) {
    document
      .querySelector(
        '#profilePhotoInput'
      )
      ?.click();

    return;
  }

  const l = L();

  document.body.insertAdjacentHTML(
    'beforeend',
    `
      <div
        class="overlay photo-overlay"
        id="photoOverlay"
      >

        <div class="photo-editor">

          <div class="editor-head">

            <div>

              <div class="micro">
                ZERO
              </div>

              <h2>
                ${l.adjust}
              </h2>

            </div>

            <button
              class="detail-close"
              onclick="
                document
                  .querySelector('#photoOverlay')
                  ?.remove()
              "
            >
              ×
            </button>

          </div>

          <div class="crop-stage">

            <div
              class="crop-circle crop-drag"
              id="cropDrag"
            >

              <img
                id="cropPreview"
                src="${profile.photo}"
                alt=""
                style="
                  object-position:
                    ${profile.photoX || 50}%
                    ${profile.photoY || 50}%;

                  transform:
                    scale(
                      ${profile.photoZoom || 1}
                    );
                "
              >

            </div>

          </div>

          <p class="drag-hint">

            ${
              profile.lang === 'fr'
                ? 'Fais glisser la photo pour la positionner.'
                : profile.lang === 'en'
                  ? 'Drag the photo to position it.'
                  : 'Arrasta a foto para a posicionar.'
            }

          </p>

          <label>
            ${l.zoom}
          </label>

          <input
            id="photoZoomRange"
            class="range"
            type="range"
            min="1"
            max="2.5"
            step="0.01"
            value="${profile.photoZoom || 1}"
            oninput="updateCrop()"
          >

          <div class="editor-actions">

            <button
              class="secondary"
              onclick="
                document
                  .querySelector('#photoOverlay')
                  ?.remove()
              "
            >
              ${l.cancel}
            </button>

            <button
              class="primary"
              onclick="savePhotoAdjust()"
            >
              ${l.savePhoto}
              <span>→</span>
            </button>

          </div>

        </div>

      </div>
    `
  );

  initPhotoDrag();
}

function updateCrop() {
  const img =
    document.querySelector(
      '#cropPreview'
    );

  if (!img) return;

  const z =
    document.querySelector(
      '#photoZoomRange'
    ).value;

  img.style.transform =
    `scale(${z})`;

  img.style.objectPosition =
    `${profile.photoX || 50}% ${profile.photoY || 50}%`;
}

function initPhotoDrag() {
  const stage =
    document.querySelector(
      '#cropDrag'
    );

  if (!stage) return;

  let dragging = false;

  let startX = 0;
  let startY = 0;

  let startPX =
    profile.photoX || 50;

  let startPY =
    profile.photoY || 50;

  const move = (x, y) => {
    if (!dragging) return;

    const dx =
      x - startX;

    const dy =
      y - startY;

    profile.photoX =
      Math.max(
        0,
        Math.min(
          100,
          startPX -
            (dx /
              stage.clientWidth) *
              100
        )
      );

    profile.photoY =
      Math.max(
        0,
        Math.min(
          100,
          startPY -
            (dy /
              stage.clientHeight) *
              100
        )
      );

    updateCrop();
  };

  stage.addEventListener(
    'pointerdown',
    e => {
      dragging = true;

      startX =
        e.clientX;

      startY =
        e.clientY;

      startPX =
        profile.photoX || 50;

      startPY =
        profile.photoY || 50;

      stage.setPointerCapture(
        e.pointerId
      );
    }
  );

  stage.addEventListener(
    'pointermove',
    e =>
      move(
        e.clientX,
        e.clientY
      )
  );

  stage.addEventListener(
    'pointerup',
    () => {
      dragging = false;
    }
  );

  stage.addEventListener(
    'pointercancel',
    () => {
      dragging = false;
    }
  );
}

function savePhotoAdjust() {
  profile.photoZoom =
    Number(
      document.querySelector(
        '#photoZoomRange'
      )?.value || 1
    );

  save();

  document
    .querySelector('#photoOverlay')
    ?.remove();

  profilePage();

  toast(
    L().profileSaved
  );
}

function saveDirectProfile() {
  profile.name =
    document
      .querySelector(
        '#profileNameDirect'
      )
      ?.value.trim() || '';

  profile.bio =
    document
      .querySelector(
        '#profileBioDirect'
      )
      ?.value.trim() || '';

  profile.lang =
    document
      .querySelector(
        '#profileLangDirect'
      )
      ?.value || 'pt';

  save();

  render();

  toast(
    L().profileSaved
  );
}

function changeLanguage(lang) {
  profile.lang = lang;

  save();

  profilePage();
}

function toggleTheme() {
  profile.theme =
    profile.theme === 'dark'
      ? 'light'
      : 'dark';

  save();

  render();
}


/* =========================================
   ELIMINAR PROJETO
   ========================================= */

function deleteProject(i) {
  const p = projects[i];

  if (!p) return;

  const l = L();

  const confirmed = confirm(
    `${l.deleteConfirm}\n\n${p.name}`
  );

  if (!confirmed) return;

  projects.splice(i, 1);

  save();

  document
    .querySelector(
      '#projectOverlay'
    )
    ?.remove();

  projectsPage();

  toast(
    l.deleted
  );
}


/* =========================================
   LIMPAR ATIVIDADE
   ========================================= */

function clearActivity() {
  const l = L();

  if (!activity.length) {
    return;
  }

  const confirmed =
    confirm(
      l.clearActivityConfirm
    );

  if (!confirmed) {
    return;
  }

  activity = [];

  save();

  render();

  toast(
    l.activityCleared
  );
}


/* =========================================
   ELIMINAR TODOS OS DADOS
   ========================================= */

function deleteAllData() {
  const l = L();

  const confirmed =
    confirm(
      l.deleteDataConfirm
    );

  if (!confirmed) {
    return;
  }

  /*
   * IMPORTANTE:
   * Não usamos localStorage.clear()
   * porque isso poderia apagar dados
   * pertencentes a outras aplicações.
   *
   * A ZERO remove apenas as suas
   * próprias chaves.
   */

  localStorage.removeItem(
    'zero-profile'
  );

  localStorage.removeItem(
    'zero-projects'
  );

  localStorage.removeItem(
    'zero-activity'
  );

  /*
   * Repor o estado da ZERO.
   */

  profile = {
    ...defaults
  };

  projects = [];

  activity = [];

  active = 'home';

  save();

  toast(
    l.dataDeleted
  );

  setTimeout(
    () => {
      location.reload();
    },
    500
  );
}


/* =========================================
   UTILITÁRIOS
   ========================================= */

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c])
  );
}

function escapeAttr(s) {
  return escapeHtml(s)
    .replace(
      /`/g,
      '&#96;'
    );
}


/* =========================================
   INICIALIZAÇÃO
   ========================================= */

render();