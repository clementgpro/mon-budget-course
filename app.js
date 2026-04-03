/* ============================================================
   Mon Budget Course — app.js
   Logique complète : questions, conditions, calcul, rendu, chart
   Données : window.COSTS_DATA + window.QUESTIONS_DATA (data/data.js)
   ============================================================ */

// ── État global ──────────────────────────────────────────────
const state = {
  answers: {},          // { questionId: value }  (checkbox → array)
  costsIndex: null,     // Map<key, costRow>
  questions: [],        // QUESTIONS_DATA
};

// ── Règles de calcul du budget ───────────────────────────────
// isOneTime: true  → investissement initial
// isOneTime: false → coût annuel
const COST_RULES = [

  // ── Karting ────────────────────────────────────────────────
  {
    key: 'achat_karting',
    label: 'Achat karting',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.karting === 'non',
    costKey: a => a.budget === 'premium' ? 'karting_neuf_haut' : 'karting_occasion',
    multiplier: _ => 1,
  },

  // ── Chariot ────────────────────────────────────────────────
  {
    key: 'achat_chariot',
    label: 'Chariot kart',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.chariot === 'non',
    costKey: a => a.budget === 'premium' ? 'chariot_premium' : 'chariot_basic',
    multiplier: _ => 1,
  },

  // ── Transport ──────────────────────────────────────────────
  {
    key: 'achat_transport',
    label: 'Transport',
    category: 'Logistique',
    isOneTime: true,
    condition: a => a.transport && a.transport !== 'deja',
    costKey: a => a.transport === 'remorque' ? 'transport_remorque' : 'transport_plateau',
    multiplier: _ => 1,
  },

  // ── Casque ─────────────────────────────────────────────────
  {
    key: 'achat_casque',
    label: 'Casque',
    category: 'Équipement',
    isOneTime: true,
    condition: a => a.casque === 'non',
    costKey: a => a.budget === 'premium' ? 'casque_premium' : 'casque_basic',
    multiplier: _ => 1,
  },

  // ── Combinaison ────────────────────────────────────────────
  {
    key: 'achat_combinaison',
    label: 'Combinaison',
    category: 'Équipement',
    isOneTime: true,
    condition: a => a.combinaison === 'non',
    costKey: a => a.budget === 'premium' ? 'combinaison_premium' : 'combinaison_basic',
    multiplier: _ => 1,
  },

  // ── Gants ──────────────────────────────────────────────────
  {
    key: 'achat_gants',
    label: 'Gants',
    category: 'Équipement',
    isOneTime: true,
    condition: a => a.gants === 'non',
    costKey: a => a.budget === 'premium' ? 'gants_premium' : 'gants_basic',
    multiplier: _ => 1,
  },

  // ── Manomètre ──────────────────────────────────────────────
  {
    key: 'achat_manometre',
    label: 'Manomètre',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.manometre === 'non',
    costKey: a => a.budget === 'premium' ? 'manometre_premium' : 'manometre_basic',
    multiplier: _ => 1,
  },

  // ── Outils ─────────────────────────────────────────────────
  {
    key: 'achat_outils',
    label: 'Outillage',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.outils === 'non',
    costKey: a => a.budget === 'premium' ? 'outils_premium' : 'outils_basic',
    multiplier: _ => 1,
  },

  // ── Gonfleur ───────────────────────────────────────────────
  {
    key: 'achat_gonfleur',
    label: 'Gonfleur',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.gonfleur === 'non',
    costKey: _ => 'gonfleur',
    multiplier: _ => 1,
  },

  // ── Tente paddock ──────────────────────────────────────────
  {
    key: 'achat_tente',
    label: 'Tente paddock',
    category: 'Logistique',
    isOneTime: true,
    condition: a => a.hebergement === 'paddock',
    costKey: _ => 'tente_paddock',
    multiplier: _ => 1,
  },

  // ────────────────────────────────────────────────────────────
  // COÛTS ANNUELS
  // ────────────────────────────────────────────────────────────

  // ── Stockage box ────────────────────────────────────────────
  {
    key: 'stockage_annuel',
    label: 'Gardiennage (box × 12 mois)',
    category: 'Logistique',
    isOneTime: false,
    condition: a => a.stockage === 'box',
    costKey: a => a.budget === 'premium' ? 'stockage_box_premium' : 'stockage_box_basic',
    multiplier: _ => 12,
  },

  // ── Révision annuelle ───────────────────────────────────────
  {
    key: 'revision_annuelle',
    label: 'Révision annuelle',
    category: 'Matériel',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition'),
    costKey: _ => 'revision_annuelle',
    multiplier: _ => 1,
  },

  // ── Droit de piste ──────────────────────────────────────────
  {
    key: 'droit_piste',
    label: 'Droit de piste à l\'année',
    category: 'Administratif',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition'),
    costKey: _ => 'droit_piste',
    multiplier: _ => 1,
  },

  // ── Licence FFSA ────────────────────────────────────────────
  {
    key: 'licence_ffsa',
    label: 'Licence FFSA',
    category: 'Administratif',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition'),
    costKey: _ => 'licence_ffsa',
    multiplier: _ => 1,
  },

  // ── Courses club ────────────────────────────────────────────
  {
    key: 'courses_club',
    label: 'Courses club (inscription)',
    category: 'Course',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && nbCoursesClub(a) > 0,
    costKey: _ => 'inscription_course_club',
    multiplier: a => nbCoursesClub(a),
  },
  {
    key: 'courses_club_box',
    label: 'Courses club (location box)',
    category: 'Course',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && nbCoursesClub(a) > 0,
    costKey: _ => 'location_box_we',
    multiplier: a => nbCoursesClub(a),
  },
  {
    key: 'courses_club_essence',
    label: 'Courses club (essence)',
    category: 'Course',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && nbCoursesClub(a) > 0,
    costKey: _ => 'essence_journee',
    multiplier: a => nbCoursesClub(a),
  },
  {
    key: 'courses_club_pneus',
    label: 'Courses club (pneus)',
    category: 'Course',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && nbCoursesClub(a) > 0,
    costKey: _ => 'pneus_vega_basic',
    multiplier: a => nbCoursesClub(a),
  },

  // ── Ligue ───────────────────────────────────────────────────
  {
    key: 'engagement_ligue',
    label: 'Ligue BPL — engagement saison',
    category: 'Course',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && a.perimetre === 'regional' && nbCoursesLigue(a) > 0,
    costKey: _ => 'engagement_ligue',
    multiplier: _ => 1,
  },
  {
    key: 'ligue_pneus',
    label: 'Ligue BPL — pneus',
    category: 'Course',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && a.perimetre === 'regional' && nbCoursesLigue(a) > 0,
    costKey: _ => 'pneus_vega_ligue',
    multiplier: a => nbCoursesLigue(a),
  },

  // ── Mécano pro ──────────────────────────────────────────────
  {
    key: 'mecano_pro',
    label: 'Mécanicien officiel',
    category: 'Services',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && a.mecanique === 'pro',
    costKey: _ => 'mecano_pro',
    multiplier: a => totalCoursesComp(a),
  },

  // ── Hébergement hôtel ───────────────────────────────────────
  {
    key: 'hebergement_hotel',
    label: 'Hébergement hôtel',
    category: 'Hébergement',
    isOneTime: false,
    condition: a => hasPractice(a, 'competition') && a.hebergement === 'hotel',
    costKey: _ => 'hotel_nuit',
    multiplier: a => totalCoursesComp(a),
  },

  // ── Loisir : sprint ─────────────────────────────────────────
  {
    key: 'loisir_sprint',
    label: 'Sprint loisir (karting location)',
    category: 'Loisir',
    isOneTime: false,
    condition: a => hasPractice(a, 'loisir') && nbSprint(a) > 0,
    costKey: _ => 'sprint_location',
    multiplier: a => nbSprint(a) * 12,
  },

  // ── Loisir : endurance ──────────────────────────────────────
  {
    key: 'loisir_endurance_2h',
    label: 'Endurance 2H (loisir)',
    category: 'Loisir',
    isOneTime: false,
    condition: a => hasPractice(a, 'loisir') && nbEndurance(a, '2h') > 0,
    costKey: _ => 'endurance_2h',
    multiplier: a => nbEndurance(a, '2h'),
  },
  {
    key: 'loisir_endurance_4h',
    label: 'Endurance 4H (loisir)',
    category: 'Loisir',
    isOneTime: false,
    condition: a => hasPractice(a, 'loisir') && nbEndurance(a, '4h') > 0,
    costKey: _ => 'endurance_4h',
    multiplier: a => nbEndurance(a, '4h'),
  },
  {
    key: 'loisir_endurance_6h',
    label: 'Endurance 6H (loisir)',
    category: 'Loisir',
    isOneTime: false,
    condition: a => hasPractice(a, 'loisir') && nbEndurance(a, '6h') > 0,
    costKey: _ => 'endurance_6h',
    multiplier: a => nbEndurance(a, '6h'),
  },
  {
    key: 'loisir_endurance_12h',
    label: 'Endurance 12H (loisir)',
    category: 'Loisir',
    isOneTime: false,
    condition: a => hasPractice(a, 'loisir') && nbEndurance(a, '12h') > 0,
    costKey: _ => 'endurance_12h',
    multiplier: a => nbEndurance(a, '12h'),
  },
  {
    key: 'loisir_endurance_24h',
    label: 'Endurance 24H (loisir)',
    category: 'Loisir',
    isOneTime: false,
    condition: a => hasPractice(a, 'loisir') && nbEndurance(a, '24h') > 0,
    costKey: _ => 'endurance_24h',
    multiplier: a => nbEndurance(a, '24h'),
  },
];

// ── Helpers d'accès à l'état ─────────────────────────────────

/** Vérifie si une pratique est sélectionnée (checkbox = array) */
function hasPractice(a, value) {
  return Array.isArray(a.pratique) && a.pratique.includes(value);
}

function nbCoursesClub(a) {
  return parseInt(a.nb_courses_club, 10) || 0;
}

function nbCoursesLigue(a) {
  return parseInt(a.nb_courses_ligue, 10) || 0;
}

/** Nombre total de journées de compétition (club + ligue) */
function totalCoursesComp(a) {
  return nbCoursesClub(a) + nbCoursesLigue(a);
}

function nbSprint(a) {
  return parseInt(a.nb_sprint, 10) || 0;
}

/** Nombre de sessions endurance pour une durée donnée */
function nbEndurance(a, duree) {
  const raw = a[`endurance_${duree}`];
  return parseInt(raw, 10) || 0;
}

// ── Debounce ────────────────────────────────────────────────
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// ── Initialisation ───────────────────────────────────────────
function init() {
  // 1. Construire l'index des coûts
  state.costsIndex = buildCostsIndex(window.COSTS_DATA);

  // 2. Charger les questions
  state.questions = window.QUESTIONS_DATA;

  // 3. Initialiser les réponses par défaut
  for (const q of state.questions) {
    if (q.type === 'checkbox') {
      state.answers[q.id] = [];
    } else if (q.defaultValue !== null && q.defaultValue !== undefined) {
      state.answers[q.id] = q.defaultValue;
    }
  }

  // 4. Générer le DOM des questions
  renderQuestions();

  // 5. Appliquer les conditions initiales
  evaluateConditions();

  // 6. Premier calcul (vide)
  calculateAndRender();

  // 7. Dark mode
  initTheme();

  // 8. Tooltip sur le tableau
  initTooltip();
}

// ── Index des coûts ──────────────────────────────────────────
function buildCostsIndex(data) {
  const map = new Map();
  for (const row of data) {
    map.set(row.key, row);
  }
  return map;
}

// ── Rendu des questions ──────────────────────────────────────
function renderQuestions() {
  const panel = document.getElementById('questions-panel');
  panel.innerHTML = '';
  let cardIndex = 0;

  // Grouper par section
  const groups = {};
  const groupOrder = [];
  for (const q of state.questions) {
    const g = q.group || 'Général';
    if (!groups[g]) {
      groups[g] = [];
      groupOrder.push(g);
    }
    groups[g].push(q);
  }

  for (const groupName of groupOrder) {
    const groupEl = document.createElement('div');
    groupEl.className = 'question-group';

    // Titre cliquable avec chevron
    const title = document.createElement('div');
    title.className = 'question-group-title';
    title.innerHTML =
      '<span>' + groupName + '</span>' +
      '<svg class="group-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
        '<path d="M2.5 5l4.5 4 4.5-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
    title.addEventListener('click', () => groupEl.classList.toggle('collapsed'));
    groupEl.appendChild(title);

    // Corps avec animation stagger
    const body = document.createElement('div');
    body.className = 'question-group-body';

    for (const q of groups[groupName]) {
      const card = buildQuestionCard(q);
      card.style.setProperty('--card-index', cardIndex++);
      body.appendChild(card);
    }

    groupEl.appendChild(body);
    panel.appendChild(groupEl);
  }
}

function buildQuestionCard(q) {
  const card = document.createElement('div');
  card.className = 'question-card';
  card.id = `card-${q.id}`;

  // Label
  const label = document.createElement('div');
  label.className = 'question-label';
  label.textContent = q.label;
  card.appendChild(label);

  // Hint
  if (q.hint) {
    const hint = document.createElement('div');
    hint.className = 'question-hint';
    hint.textContent = q.hint;
    card.appendChild(hint);
  }

  // Contrôle selon le type
  switch (q.type) {
    case 'radio':
      card.appendChild(buildRadio(q));
      break;
    case 'checkbox':
      card.appendChild(buildCheckbox(q));
      break;
    case 'number':
      card.appendChild(buildNumber(q));
      break;
    case 'select':
      card.appendChild(buildSelect(q));
      break;
    case 'endurance':
      card.appendChild(buildEndurance(q));
      break;
  }

  return card;
}

// ── Builders de contrôles ────────────────────────────────────
function buildRadio(q) {
  // Use pill buttons for short-option radios (max 3 opts, all labels <= 50 chars)
  const isCompact = q.options.length <= 3 && q.options.every(o => o.label.length <= 50);
  if (isCompact) return buildRadioPills(q);

  const list = document.createElement('div');
  list.className = 'options-list';

  for (const opt of q.options) {
    const item = document.createElement('label');
    item.className = 'option-item';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `q-${q.id}`;
    input.value = opt.value;
    input.id = `opt-${q.id}-${opt.value}`;
    if (state.answers[q.id] === opt.value) input.checked = true;

    input.addEventListener('change', () => {
      handleAnswer(q.id, opt.value);
    });

    const lbl = document.createElement('label');
    lbl.htmlFor = `opt-${q.id}-${opt.value}`;
    lbl.textContent = opt.label;

    item.appendChild(input);
    item.appendChild(lbl);
    list.appendChild(item);
  }

  return list;
}


function buildRadioPills(q) {
  const wrap = document.createElement('div');
  wrap.className = 'options-inline';
  for (const opt of q.options) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-toggle' + (state.answers[q.id] === opt.value ? ' selected' : '');
    btn.textContent = opt.label;
    btn.dataset.value = opt.value;
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.option-toggle').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      handleAnswer(q.id, opt.value);
    });
    wrap.appendChild(btn);
  }
  return wrap;
}

function buildCheckbox(q) {
  const list = document.createElement('div');
  list.className = 'options-list';

  for (const opt of q.options) {
    const item = document.createElement('div');
    item.className = 'option-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = opt.value;
    input.id = `opt-${q.id}-${opt.value}`;

    const current = state.answers[q.id] || [];
    if (current.includes(opt.value)) input.checked = true;

    input.addEventListener('change', () => {
      const arr = Array.isArray(state.answers[q.id]) ? [...state.answers[q.id]] : [];
      if (input.checked) {
        if (!arr.includes(opt.value)) arr.push(opt.value);
      } else {
        const idx = arr.indexOf(opt.value);
        if (idx > -1) arr.splice(idx, 1);
      }
      handleAnswer(q.id, arr);
    });

    const lbl = document.createElement('label');
    lbl.htmlFor = `opt-${q.id}-${opt.value}`;
    lbl.textContent = opt.label;

    item.appendChild(input);
    item.appendChild(lbl);
    list.appendChild(item);
  }

  return list;
}

function buildNumber(q) {
  const wrapper = document.createElement('div');
  wrapper.className = 'number-input-wrapper';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = q.min ?? 0;
  input.max = q.max ?? 999;
  input.value = state.answers[q.id] ?? (q.defaultValue ?? 0);
  input.id = `num-${q.id}`;

  const debouncedHandle = debounce((id, val) => handleAnswer(id, val), 280);
  input.addEventListener('input', () => {
    const val = Math.max(q.min ?? 0, Math.min(q.max ?? 999, parseInt(input.value, 10) || 0));
    input.value = val;
    debouncedHandle(q.id, val);
  });

  // Stepper buttons
  const stepper = document.createElement('div');
  stepper.className = 'number-stepper';

  const btnMinus = document.createElement('button');
  btnMinus.type = 'button';
  btnMinus.textContent = '−';
  btnMinus.setAttribute('aria-label', 'Diminuer');
  btnMinus.addEventListener('click', () => {
    const cur = parseInt(input.value, 10) || 0;
    const next = Math.max(q.min ?? 0, cur - 1);
    input.value = next;
    handleAnswer(q.id, next);
  });

  const btnPlus = document.createElement('button');
  btnPlus.type = 'button';
  btnPlus.textContent = '+';
  btnPlus.setAttribute('aria-label', 'Augmenter');
  btnPlus.addEventListener('click', () => {
    const cur = parseInt(input.value, 10) || 0;
    const next = Math.min(q.max ?? 999, cur + 1);
    input.value = next;
    handleAnswer(q.id, next);
  });

  stepper.appendChild(btnMinus);
  stepper.appendChild(btnPlus);
  wrapper.appendChild(input);
  wrapper.appendChild(stepper);

  return wrapper;
}

function buildSelect(q) {
  const sel = document.createElement('select');
  sel.className = 'question-select';
  sel.id = `sel-${q.id}`;

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '— Choisir —';
  placeholder.disabled = true;
  placeholder.selected = !state.answers[q.id];
  sel.appendChild(placeholder);

  for (const opt of q.options) {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    if (state.answers[q.id] === opt.value) option.selected = true;
    sel.appendChild(option);
  }

  sel.addEventListener('change', () => {
    handleAnswer(q.id, sel.value);
  });

  return sel;
}

function buildEndurance(q) {
  const grid = document.createElement('div');
  grid.className = 'endurance-grid';

  for (const opt of q.options) {
    const row = document.createElement('div');
    row.className = 'endurance-row';

    const lbl = document.createElement('label');
    lbl.htmlFor = `end-${q.id}-${opt.value}`;
    lbl.textContent = opt.label;

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `end-${q.id}-${opt.value}`;
    input.min = 0;
    input.max = 20;
    input.value = state.answers[`endurance_${opt.value}`] || 0;

    input.addEventListener('input', () => {
      const val = Math.max(0, parseInt(input.value, 10) || 0);
      input.value = val;
      handleAnswer(`endurance_${opt.value}`, val);
    });

    const span = document.createElement('span');
    span.textContent = 'fois / an';

    row.appendChild(lbl);
    row.appendChild(input);
    row.appendChild(span);
    grid.appendChild(row);
  }

  return grid;
}

// ── Gestion des réponses ─────────────────────────────────────
function handleAnswer(id, value) {
  state.answers[id] = value;
  evaluateConditions();
  applyPrefills();
  calculateAndRender();
}

// ── Évaluation des conditions ────────────────────────────────
function evaluateConditions() {
  for (const q of state.questions) {
    const card = document.getElementById(`card-${q.id}`);
    if (!card) continue;

    const visible = isQuestionVisible(q);
    card.classList.toggle('hidden', !visible);
  }
}

function isQuestionVisible(q) {
  if (!q.condition) return true;

  // Format : "questionId=value"
  const [condId, condVal] = q.condition.split('=');
  const answer = state.answers[condId];

  // checkbox : vérifie si la valeur est dans le tableau
  if (Array.isArray(answer)) {
    return answer.includes(condVal);
  }
  return answer === condVal;
}

// ── Pré-remplissage automatique ──────────────────────────────
function applyPrefills() {
  for (const q of state.questions) {
    if (!q.prefill) continue;

    // Format : "sourceId=value>cibleId=valeur"
    const [trigger, target] = q.prefill.split('>');
    const [srcId, srcVal] = trigger.split('=');
    const [tgtId, tgtVal] = target.split('=');

    const srcAnswer = state.answers[srcId];
    const matches = Array.isArray(srcAnswer)
      ? srcAnswer.includes(srcVal)
      : srcAnswer === srcVal;

    if (matches) {
      // Uniquement si pas encore répondu manuellement
      if (!state.answers[tgtId] || state.answers[tgtId] === q.defaultValue) {
        state.answers[tgtId] = tgtVal;
        syncInputValue(tgtId, tgtVal);
      }
    }
  }
}

/** Synchronise la valeur d'un input DOM avec l'état */
function syncInputValue(id, value) {
  // Pills (compact radio)
  const pill = document.querySelector(`#card-${id} .option-toggle[data-value="${value}"]`);
  if (pill) {
    pill.closest('.options-inline').querySelectorAll('.option-toggle').forEach(b => b.classList.remove('selected'));
    pill.classList.add('selected');
    return;
  }

  // Radio
  const radio = document.querySelector(`input[name="q-${id}"][value="${value}"]`);
  if (radio) { radio.checked = true; return; }

  // Select
  const sel = document.getElementById(`sel-${id}`);
  if (sel) { sel.value = value; return; }

  // Number
  const num = document.getElementById(`num-${id}`);
  if (num) { num.value = value; return; }
}

// ── Calcul du budget ─────────────────────────────────────────
function calculateAndRender() {
  const a = state.answers;
  const items = [];

  for (const rule of COST_RULES) {
    // Évaluer la condition
    let condOk = false;
    try {
      condOk = rule.condition(a);
    } catch (_) {
      condOk = false;
    }
    if (!condOk) continue;

    // Récupérer le coût
    const costKey = rule.costKey(a);
    const costRow = state.costsIndex.get(costKey);
    if (!costRow) continue;

    const multiplier = rule.multiplier(a);
    if (multiplier <= 0) continue;

    const montant = costRow.prix * multiplier;

    items.push({
      ruleKey:     rule.key,
      label:       rule.label,
      description: costRow.description,
      category:    rule.category,
      isOneTime:   rule.isOneTime,
      montant,
      source:      costRow.source,
      unitPrice:   costRow.prix,
      multiplier,
    });
  }

  renderResults(items);
}

// ── Rendu des résultats ──────────────────────────────────────
function renderResults(items) {
  const invest = items.filter(i => i.isOneTime);
  const annual  = items.filter(i => !i.isOneTime);

  const totalInvest = invest.reduce((s, i) => s + i.montant, 0);
  const totalAnnual = annual.reduce((s, i) => s + i.montant, 0);
  const grand = totalInvest + totalAnnual;

  // ── Totaux ──────────────────────────────────────────────────
  const fmt = n => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  setText('total-invest', items.length ? fmt(totalInvest) : '— €');
  setText('total-annual', items.length ? fmt(totalAnnual) : '— €');
  setText('total-grand',  items.length ? fmt(grand)       : '— €');
  setText('budget-bar-amount', items.length ? fmt(grand)  : '— €');

  // Pulse animation
  const barEl = document.getElementById('budget-bar-amount');
  if (barEl) {
    barEl.classList.remove('pulse');
    void barEl.offsetWidth; // force reflow
    barEl.classList.add('pulse');
  }

  // ── Tableau ───────────────────────────────────────────────
  renderTable(invest, annual, fmt);

}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderTable(invest, annual, fmt) {
  const tbody = document.getElementById('detail-tbody');
  tbody.innerHTML = '';

  if (invest.length === 0 && annual.length === 0) {
    const tr = document.createElement('tr');
    tr.className = 'table-empty';
    tr.innerHTML = '<td colspan="4">Répondez aux questions pour voir le détail des dépenses.</td>';
    tbody.appendChild(tr);
    return;
  }

  const addSectionHeader = (label) => {
    const tr = document.createElement('tr');
    tr.className = 'section-header';
    tr.innerHTML = `<td colspan="4">${label}</td>`;
    tbody.appendChild(tr);
  };

  const addRow = (item) => {
    const tr = document.createElement('tr');
    if (item.description) tr.dataset.tip = item.description;

    const multiplierInfo = item.multiplier > 1
      ? ` <small style="color:var(--text-faint)">× ${item.multiplier}</small>`
      : '';
    const sourceHtml = item.source && item.source.startsWith('http')
      ? `<a href="${escapeHtml(item.source)}" target="_blank" rel="noopener noreferrer" style="color:var(--text-faint);font-size:.75rem">↗ source</a>`
      : (item.source ? `<span style="color:var(--text-faint);font-size:.75rem">${escapeHtml(item.source)}</span>` : '');

    const badgeClass = item.isOneTime ? 'td-type-badge badge-invest' : 'td-type-badge';
    const typeLabel  = item.isOneTime ? 'Initial' : 'Annuel';

    tr.innerHTML = `
      <td class="td-category">${escapeHtml(item.category)}</td>
      <td class="td-desc">
        ${escapeHtml(item.label)}${multiplierInfo}
        ${sourceHtml ? `<br>${sourceHtml}` : ''}
      </td>
      <td class="col-type"><span class="${badgeClass}">${typeLabel}</span></td>
      <td class="col-amount td-amount">${fmt(item.montant)}</td>
    `;
    tbody.appendChild(tr);
  };

  // Section investissement
  if (invest.length > 0) {
    addSectionHeader('Investissement initial');
    invest.forEach(addRow);
  }

  // Section annuel
  if (annual.length > 0) {
    addSectionHeader('Coûts annuels');
    annual.forEach(addRow);
  }

  // Grand total
  const allItems = [...invest, ...annual];
  const grand = allItems.reduce((s, i) => s + i.montant, 0);
  const trTotal = document.createElement('tr');
  trTotal.className = 'row-grand-total';
  trTotal.innerHTML = `
    <td colspan="3" style="font-weight:600">Budget Année 1</td>
    <td class="col-amount td-amount">${fmt(grand)}</td>
  `;
  tbody.appendChild(trTotal);
}

// ── Theme ────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('mbc-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
  }

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('mbc-theme', isDark ? 'dark' : 'light');
}

// ── Utilitaires ──────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Démarrage ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

// ── Tooltip produit ─────────────────────────────────────────────────────────
function initTooltip() {
  const tip = document.getElementById('tooltip');
  const table = document.getElementById('detail-table');
  if (!tip || !table) return;

  table.addEventListener('mouseover', (e) => {
    const tr = e.target.closest('tr[data-tip]');
    if (!tr) { tip.hidden = true; return; }
    tip.textContent = tr.dataset.tip;
    tip.hidden = false;
  });

  table.addEventListener('mousemove', (e) => {
    if (!tip.hidden) {
      const x = Math.min(e.clientX + 16, window.innerWidth - 380);
      tip.style.left = x + 'px';
      tip.style.top = (e.clientY - 34) + 'px';
    }
  });

  table.addEventListener('mouseleave', () => {
    tip.hidden = true;
  });
}


