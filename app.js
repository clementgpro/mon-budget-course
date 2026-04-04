/* ============================================================
   Mon Budget Course — app.js
   Logique complète : questions, conditions, calcul, rendu, chart
   Données : window.COSTS_DATA + window.QUESTIONS_DATA (data/data.js)
   ============================================================ */

// ── État global ──────────────────────────────────────────────
const state = {
  answers: {},           // { questionId: value }  (checkbox → array)
  costsIndex: null,      // Map<key, costRow>
  questions: [],         // QUESTIONS_DATA
  touchedIds: new Set(), // IDs explicitement répondus (number/endurance)
  calculated: false,     // true après clic "Calculer"
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
    costKey: a => (a.karting_gamme || a.budget) === 'premium' ? 'karting_neuf_haut' : 'karting_occasion',
    multiplier: _ => 1,
  },

  // ── Chariot ────────────────────────────────────────────────
  {
    key: 'achat_chariot',
    label: 'Chariot kart',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.chariot === 'non',
    costKey: a => (a.chariot_gamme || a.budget) === 'premium' ? 'chariot_premium' : 'chariot_basic',
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
    costKey: a => (a.casque_gamme || a.budget) === 'premium' ? 'casque_premium' : 'casque_basic',
    multiplier: _ => 1,
  },

  // ── Combinaison ────────────────────────────────────────────
  {
    key: 'achat_combinaison',
    label: 'Combinaison',
    category: 'Équipement',
    isOneTime: true,
    condition: a => a.combinaison === 'non',
    costKey: a => (a.combinaison_gamme || a.budget) === 'premium' ? 'combinaison_premium' : 'combinaison_basic',
    multiplier: _ => 1,
  },

  // ── Gants ──────────────────────────────────────────────────
  {
    key: 'achat_gants',
    label: 'Gants',
    category: 'Équipement',
    isOneTime: true,
    condition: a => a.gants === 'non',
    costKey: a => (a.gants_gamme || a.budget) === 'premium' ? 'gants_premium' : 'gants_basic',
    multiplier: _ => 1,
  },

  // ── Manomètre ──────────────────────────────────────────────
  {
    key: 'achat_manometre',
    label: 'Manomètre',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.manometre === 'non',
    costKey: a => (a.manometre_gamme || a.budget) === 'premium' ? 'manometre_premium' : 'manometre_basic',
    multiplier: _ => 1,
  },

  // ── Outils ─────────────────────────────────────────────────
  {
    key: 'achat_outils',
    label: 'Outillage',
    category: 'Matériel',
    isOneTime: true,
    condition: a => a.outils === 'non',
    costKey: a => (a.outils_gamme || a.budget) === 'premium' ? 'outils_premium' : 'outils_basic',
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
    condition: a => a.revision_moteur === 'oui',
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
    costKey: a => a.categorie === 'senior' || a.categorie === 'master' || a.categorie === 'kz2'
      ? 'licence_ffsa_nnck'
      : 'licence_ffsa_necchk',
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

  // ── Services team
  {
    key: 'team_chassis',
    label: 'Location châssis (team)',
    category: 'Services',
    isOneTime: false,
    condition: a => a.team === 'oui',
    costKey: _ => 'location_chassis_we',
    multiplier: a => totalCoursesComp(a) || 1,
  },
  {
    key: 'team_moteur',
    label: 'Location moteur (team)',
    category: 'Services',
    isOneTime: false,
    condition: a => a.team === 'oui',
    costKey: _ => 'location_moteur_we',
    multiplier: a => totalCoursesComp(a) || 1,
  },
  {
    key: 'team_services',
    label: 'Services team (tente, outils)',
    category: 'Services',
    isOneTime: false,
    condition: a => a.team === 'oui',
    costKey: _ => 'service_team_tente',
    multiplier: _ => 1,
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

// ── Mapping gamme éco/premium par question ────────────────────
// La clé correspond à q.id ; eco/premium sont des clés de COSTS_DATA
const PRICE_HINT_MAP = {
  karting:     { gammeKey: 'karting_gamme',     eco: 'karting_occasion',  premium: 'karting_neuf_haut' },
  chariot:     { gammeKey: 'chariot_gamme',     eco: 'chariot_basic',     premium: 'chariot_premium' },
  casque:      { gammeKey: 'casque_gamme',      eco: 'casque_basic',      premium: 'casque_premium' },
  combinaison: { gammeKey: 'combinaison_gamme', eco: 'combinaison_basic', premium: 'combinaison_premium' },
  gants:       { gammeKey: 'gants_gamme',       eco: 'gants_basic',       premium: 'gants_premium' },
  manometre:   { gammeKey: 'manometre_gamme',   eco: 'manometre_basic',   premium: 'manometre_premium' },
  outils:      { gammeKey: 'outils_gamme',      eco: 'outils_basic',      premium: 'outils_premium' },
};

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
  return parseInt(a.nb_courses_loisir, 10) || 0;
}

/** Nombre de sessions endurance pour une durée donnée */
function nbEndurance(a, duree) {
  const raw = a[`endurance_${duree}`];
  return parseInt(raw, 10) || 0;
}

// ── Gamme toggle (barre sticky) ──────────────────────────────────

/** Affiche la barre, met à jour le bouton actif, rafraîchit les chips de prix */
function updateGammeUI(value) {
  const bar = document.getElementById('budget-bar');
  if (bar) bar.classList.add('budget-bar--visible');

  document.querySelectorAll('.gamme-btn').forEach(btn => {
    btn.classList.toggle('gamme-btn--active', btn.dataset.gamme === value);
  });

  // Le choix global propage à tous les items (reset)
  for (const hints of Object.values(PRICE_HINT_MAP)) {
    state.answers[hints.gammeKey] = value;
  }

  updateAllPriceHints();
}

/** (Re)génère les chips de prix dans toutes les cartes concernées */
function updateAllPriceHints() {
  for (const [qId, hints] of Object.entries(PRICE_HINT_MAP)) {
    const div = document.getElementById(`price-hint-${qId}`);
    if (!div) continue;
    // Gamme de cet item : choix individuel ou fallback sur le budget global
    const itemGamme = state.answers[hints.gammeKey] || state.answers.budget;
    renderPriceHint(div, hints, itemGamme);
  }
}

/**
 * (Re)crée le contenu d'un .price-hint.
 * @param {HTMLElement} div - conteneur .price-hint
 * @param {{ eco: string, premium: string }} hints - clés COSTS_DATA
 * @param {string|undefined} activeBudget - 'economique' | 'premium' | undefined
 */
function renderPriceHint(div, hints, activeBudget) {
  div.innerHTML = '';
  const fmt = n => n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '\u00a0\u20ac';

  const chips = [
    { gamme: 'economique', label: '\u00c9co.', costKey: hints.eco },
    { gamme: 'premium',    label: 'Premium', costKey: hints.premium },
  ];

  for (const chip of chips) {
    const row = state.costsIndex && state.costsIndex.get(chip.costKey);
    if (!row) continue;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'price-hint-chip' +
      (activeBudget === chip.gamme ? ' price-hint-chip--active' : '');
    btn.setAttribute('aria-pressed', activeBudget === chip.gamme ? 'true' : 'false');
    btn.title = `Passer en gamme ${chip.label}`;
    btn.innerHTML =
      `<span class="chip-gamme">${escapeHtml(chip.label)}</span> ${escapeHtml(fmt(row.prix))}`;

    btn.addEventListener('click', () => {
      // Met à jour uniquement la gamme de cet item, pas le budget global
      handleAnswer(hints.gammeKey, chip.gamme);
      if (state.calculated) calculateAndRender();
    });

    div.appendChild(btn);
  }
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
      // Pré-marquer comme touché les champs number avec valeur par défaut
      if (q.type === 'number') state.touchedIds.add(q.id);
    }
  }

  // 4. Générer le DOM des questions (toutes verrouillées)
  renderQuestions();

  // 5. Révéler la première question
  updateReveal();

  // 6. Bouton Calculer
  const btnCalc = document.getElementById('btn-calculate');
  if (btnCalc) {
    btnCalc.addEventListener('click', () => {
      if (btnCalc.disabled) return;

      // Animation "fired" sur le bouton
      btnCalc.classList.add('btn-calculate--fired');
      btnCalc.textContent = '';
      btnCalc.innerHTML = 'Calcul en cours… <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2" stroke-dasharray="28" stroke-dashoffset="10"><animateTransform attributeName="transform" type="rotate" from="0 9 9" to="360 9 9" dur="0.7s" repeatCount="indefinite"/></circle></svg>';

      setTimeout(() => {
        state.calculated = true;
        // Réinitialiser la modale pour ce nouveau calcul
        sessionStorage.removeItem('mbc-donation-seen');

        const barEl = document.getElementById('budget-bar');
        if (barEl) barEl.classList.remove('budget-bar--pending');
        calculateAndRender();

        const detail = document.querySelector('.detail-fullwidth');
        if (detail) {
          detail.classList.remove('detail-hidden');
          // Force le re-déclenchement de l'animation en retirant puis remettant la classe
          detail.classList.remove('detail-revealed');
          void detail.offsetWidth; // reflow
          detail.classList.add('detail-revealed');
        }

        btnCalc.classList.remove('btn-calculate--fired');
        btnCalc.innerHTML = 'Voir les résultats <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 3v12M4 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        setTimeout(() => {
          const resultsEl = document.querySelector('.detail-fullwidth');
          if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }, 600);
    });
  }

  // 7. État en attente sur le panel résultats
  const totalsPanel = document.getElementById('totals-panel');
  if (totalsPanel) totalsPanel.classList.add('results-pending');

  // 8. Observer scroll pour animations
  setupIntersectionObserver();

  // 9. Dark mode
  initTheme();

  // 10. Tooltip sur le tableau
  initTooltip();

  // 11. Gamme toggle : écouteurs sur les boutons sticky de la budget-bar
  document.querySelectorAll('.gamme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const gamme = btn.dataset.gamme;
      syncInputValue('budget', gamme);
      handleAnswer('budget', gamme);
      if (state.calculated) calculateAndRender();
    });
  });

  // 12. Remplir les chips de prix dès que costsIndex est prêt
  updateAllPriceHints();
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

  for (const q of state.questions) {
    const card = buildQuestionCard(q);
    card.classList.add('card-locked');
    panel.appendChild(card);
  }
}

/** Questions simples : label à gauche, contrôle à droite sur une ligne */
function isRowLayout(q) {
  if (q.type === 'select' || q.type === 'number') return true;
  if (q.type === 'radio') {
    return q.options.length <= 3 && q.options.every(o => o.label.length <= 50);
  }
  return false;
}

function buildQuestionCard(q) {
  const card = document.createElement('div');
  card.className = 'question-card';
  card.id = `card-${q.id}`;

  const row = isRowLayout(q);
  if (row) card.classList.add('question-card--row');

  // Conteneur principal (flex row ou block selon le type)
  const main = document.createElement('div');
  main.className = row ? 'question-row-main' : 'question-stack-main';

  // Méta : label + hint (hint masqué en row pour économiser la hauteur)
  const meta = document.createElement('div');
  meta.className = 'question-meta';

  const label = document.createElement('div');
  label.className = 'question-label';
  label.textContent = q.label;
  meta.appendChild(label);

  if (q.hint && !row) {
    const hint = document.createElement('div');
    hint.className = 'question-hint';
    hint.textContent = q.hint;
    meta.appendChild(hint);
  }
  main.appendChild(meta);

  // Contrôle
  const ctrl = document.createElement('div');
  ctrl.className = 'question-control';

  switch (q.type) {
    case 'radio':    ctrl.appendChild(buildRadio(q));    break;
    case 'checkbox': ctrl.appendChild(buildCheckbox(q)); break;
    case 'number':
      ctrl.appendChild(buildNumber(q));
      ctrl.appendChild(buildContinueBtn(q));
      break;
    case 'select':   ctrl.appendChild(buildSelect(q));   break;
    case 'endurance':
      ctrl.appendChild(buildEndurance(q));
      ctrl.appendChild(buildContinueBtn(q));
      break;
  }
  main.appendChild(ctrl);
  card.appendChild(main);

  // Chips de prix éco/premium — pleine largeur sous le row
  if (PRICE_HINT_MAP[q.id]) {
    const hintDiv = document.createElement('div');
    hintDiv.className = 'price-hint';
    hintDiv.id = `price-hint-${q.id}`;
    card.appendChild(hintDiv);
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
  // Segmented binary pour les radios à exactement 2 options
  if (q.options.length === 2) return buildSegmentedBinary(q);

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
    if (opt.disabled) option.disabled = true;
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
    input.setAttribute('aria-label', `${opt.label} — nombre de fois par an`);

    const update = (val) => {
      const clamped = Math.min(20, Math.max(0, val));
      input.value = clamped;
      handleAnswer(`endurance_${opt.value}`, clamped);
    };

    input.addEventListener('input', () => {
      update(parseInt(input.value, 10) || 0);
    });

    const btnMinus = document.createElement('button');
    btnMinus.type = 'button';
    btnMinus.textContent = '−';
    btnMinus.setAttribute('aria-label', `Diminuer ${opt.label}`);
    btnMinus.addEventListener('click', () => update((parseInt(input.value, 10) || 0) - 1));

    const btnPlus = document.createElement('button');
    btnPlus.type = 'button';
    btnPlus.textContent = '+';
    btnPlus.setAttribute('aria-label', `Augmenter ${opt.label}`);
    btnPlus.addEventListener('click', () => update((parseInt(input.value, 10) || 0) + 1));

    const stepper = document.createElement('div');
    stepper.className = 'number-stepper';
    stepper.appendChild(btnMinus);
    stepper.appendChild(btnPlus);

    const span = document.createElement('span');
    span.textContent = 'fois / an';

    row.appendChild(lbl);
    row.appendChild(input);
    row.appendChild(stepper);
    row.appendChild(span);
    grid.appendChild(row);
  }

  return grid;
}

// ── Gestion des réponses ─────────────────────────────────────
function handleAnswer(id, value) {
  state.answers[id] = value;
  if (id === 'budget') updateGammeUI(value);
  applyPrefills();
  updateReveal();
}

// ── Évaluation des conditions ────────────────────────────────

function isQuestionVisible(q) {
  if (!q.condition) return true;

  // Format : "id=val1|val2&id2=val3" — AND entre clauses (&), OR entre valeurs (|)
  const clauses = q.condition.split('&');
  return clauses.every(clause => {
    const eqIdx  = clause.indexOf('=');
    const condId  = clause.slice(0, eqIdx).trim();
    const condVal = clause.slice(eqIdx + 1).trim();
    const answer  = state.answers[condId];
    const allowed = condVal.split('|');

    if (Array.isArray(answer)) {
      return allowed.some(v => answer.includes(v));
    }
    return allowed.includes(answer);
  });
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
  if (!state.calculated) return;

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

  // Animate grand total counter
  const grandEl = document.getElementById('total-grand');
  const barEl = document.getElementById('budget-bar-amount');
  if (items.length) {
    if (grandEl) animateCounter(grandEl, 0, grand, 1400);
    if (barEl) animateCounter(barEl, 0, grand, 1400);
  } else {
    setText('total-grand', '— €');
    setText('budget-bar-amount', '— €');
  }

  // Retirer l'état en attente
  const totalsPanel = document.getElementById('totals-panel');
  if (totalsPanel) totalsPanel.classList.remove('results-pending');

  // ── Tableau ───────────────────────────────────────────────
  renderTable(invest, annual, fmt);

  // Programmer la pop-up de don
  if (grand > 0) {
    setTimeout(() => showDonationPopup(grand), 1500);
  }
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

  let rowIdx = 0;
  const addRow = (item) => {
    const tr = document.createElement('tr');
    tr.style.setProperty('--row-index', rowIdx++);
    tr.classList.add('table-row-reveal');
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

// ── Segmented binary control (Oui / Non) ─────────────────────
function buildSegmentedBinary(q) {
  const wrap = document.createElement('div');
  wrap.className = 'seg-control';
  const selected = state.answers[q.id];
  const selIdx = selected !== undefined && selected !== null
    ? q.options.findIndex(o => o.value === selected)
    : -1;
  if (selIdx >= 0) wrap.dataset.selIdx = String(selIdx);

  const indicator = document.createElement('div');
  indicator.className = 'seg-indicator';
  wrap.appendChild(indicator);

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'seg-btn' + (selected === opt.value ? ' seg-btn--active' : '');
    btn.textContent = opt.label;
    btn.dataset.value = opt.value;
    btn.setAttribute('aria-pressed', selected === opt.value ? 'true' : 'false');
    btn.addEventListener('click', () => {
      wrap.dataset.selIdx = String(i);
      wrap.querySelectorAll('.seg-btn').forEach((b, bi) => {
        b.classList.toggle('seg-btn--active', bi === i);
        b.setAttribute('aria-pressed', bi === i ? 'true' : 'false');
      });
      handleAnswer(q.id, opt.value);
    });
    wrap.appendChild(btn);
  });
  return wrap;
}

// ── Bouton Continuer (number / endurance) ─────────────────────
function buildContinueBtn(q) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'question-continue-btn';
  btn.innerHTML = 'Continuer <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  btn.addEventListener('click', () => {
    state.touchedIds.add(q.id);
    updateReveal();
  });
  return btn;
}

// ── Questions progressives ────────────────────────────────────
function getVisibleQuestions() {
  return state.questions.filter(q => isQuestionVisible(q));
}

function isQuestionAnswered(q) {
  if (q.type === 'number' || q.type === 'endurance') {
    return state.touchedIds.has(q.id);
  }
  const val = state.answers[q.id];
  if (q.type === 'checkbox') return Array.isArray(val) && val.length > 0;
  return val !== null && val !== undefined && val !== '';
}

function updateReveal() {
  const visible = getVisibleQuestions();
  const visibleIds = new Set(visible.map(q => q.id));

  // Verrouiller les cartes qui ne sont plus visibles
  for (const q of state.questions) {
    if (!visibleIds.has(q.id)) {
      const card = document.getElementById(`card-${q.id}`);
      if (card && !card.classList.contains('card-locked')) {
        card.classList.add('card-locked');
        card.classList.remove('card-unlocked', 'card-reveal');
      }
    }
  }

  // Calculer jusqu'où déverrouiller :
  // Q[0] toujours visible ; Q[i] visible si Q[i-1] répondu
  let unlockUpTo = 0;
  for (let i = 0; i < visible.length - 1; i++) {
    if (isQuestionAnswered(visible[i])) {
      unlockUpTo = i + 1;
    } else {
      break;
    }
  }

  // Déverrouiller les cartes 0..unlockUpTo
  for (let i = 0; i <= unlockUpTo; i++) {
    const q = visible[i];
    const card = document.getElementById(`card-${q.id}`);
    if (!card) continue;

    if (card.classList.contains('card-locked')) {
      card.classList.remove('card-locked');
      card.classList.add('card-unlocked', 'card-reveal');
      if (i > 0) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      }
      setTimeout(() => card.classList.remove('card-reveal'), 700);
    } else {
      card.classList.add('card-unlocked');
    }
  }

  updateCalculateButton(visible);
}

function updateCalculateButton(visible) {
  const btn = document.getElementById('btn-calculate');
  const progressText = document.getElementById('calculate-progress-text');
  const progressFill = document.getElementById('calculate-progress-fill');
  if (!btn) return;

  const answered = visible.filter(q => isQuestionAnswered(q)).length;
  const total = visible.length;
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  if (progressFill) progressFill.style.width = pct + '%';

  if (answered === total && total > 0) {
    btn.disabled = false;
    if (progressText) progressText.textContent = 'Toutes les questions sont complétées !';
  } else {
    btn.disabled = true;
    if (progressText) {
      if (answered === 0) {
        progressText.textContent = 'Commence par répondre à la première question';
      } else {
        const remaining = total - answered;
        progressText.textContent = `${answered}/${total} — encore ${remaining} question${remaining > 1 ? 's' : ''} à compléter`;
      }
    }
  }
}

// ── Counter animé ─────────────────────────────────────────────
function animateCounter(el, start, end, duration) {
  if (!el) return;
  const fmt = n => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    el.textContent = fmt(current);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = fmt(end);
  }
  requestAnimationFrame(step);
}

// ── Pop-up don ────────────────────────────────────────────────
function showDonationPopup(grand) {
  if (sessionStorage.getItem('mbc-donation-seen')) return;
  sessionStorage.setItem('mbc-donation-seen', '1');

  const overlay = document.getElementById('donation-overlay');
  if (!overlay) return;

  const amtEl = document.getElementById('donation-amount');
  const donationAmt = grand * 0.01;
  const fmt = n => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  overlay.hidden = false;
  if (amtEl) {
    amtEl.textContent = fmt(0);
    setTimeout(() => animateCounter(amtEl, 0, donationAmt, 1000), 300);
  }

  const closeFn = () => { overlay.hidden = true; };
  const closeBtn = document.getElementById('donation-close');
  const skipBtn = document.getElementById('donation-skip');
  if (closeBtn) closeBtn.addEventListener('click', closeFn);
  if (skipBtn) skipBtn.addEventListener('click', closeFn);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeFn(); });
}

// ── IntersectionObserver (scroll animations) ──────────────────
function setupIntersectionObserver() {
  if (!('IntersectionObserver' in window)) return;

  const simSection = document.getElementById('simulator');
  if (simSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sim-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(simSection);
  }

  // About sections reveal (if on about.html)
  document.querySelectorAll('.about-section').forEach((section, i) => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(section);
  });
}

// ── Tooltip produit ─────────────────────────────────────────────────────────
function initTooltip() {
  const tip = document.getElementById('tooltip');
  const table = document.getElementById('detail-table');
  if (!tip || !table) return;

  let rafId = null;

  const showTip = (text, cx, cy) => {
    tip.textContent = text;
    tip.hidden = false;
    // Position after un-hiding so getBoundingClientRect is valid
    requestAnimationFrame(() => {
      const TW = tip.offsetWidth;
      const TH = tip.offsetHeight;
      const GAP = 14;
      const VW = window.innerWidth;
      const VH = window.innerHeight;

      let x = cx + GAP;
      let y = cy - TH / 2;

      // Flip left if overflows right
      if (x + TW + 8 > VW) x = cx - TW - GAP;
      // Clamp top/bottom
      y = Math.max(8, Math.min(y, VH - TH - 8));

      tip.style.left = x + 'px';
      tip.style.top  = y + 'px';
      tip.classList.add('tooltip--visible');
    });
  };

  const hideTip = () => {
    tip.classList.remove('tooltip--visible');
    // Wait for fade-out then really hide
    setTimeout(() => { tip.hidden = true; }, 150);
  };

  table.addEventListener('mouseover', (e) => {
    const tr = e.target.closest('tr[data-tip]');
    if (!tr) { hideTip(); return; }
    showTip(tr.dataset.tip, e.clientX, e.clientY);
  });

  table.addEventListener('mousemove', (e) => {
    if (tip.classList.contains('tooltip--visible')) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const TW = tip.offsetWidth;
        const TH = tip.offsetHeight;
        const GAP = 14;
        const VW = window.innerWidth;
        const VH = window.innerHeight;

        let x = e.clientX + GAP;
        let y = e.clientY - TH / 2;
        if (x + TW + 8 > VW) x = e.clientX - TW - GAP;
        y = Math.max(8, Math.min(y, VH - TH - 8));

        tip.style.left = x + 'px';
        tip.style.top  = y + 'px';
      });
    }
  });

  table.addEventListener('mouseleave', hideTip);
}


