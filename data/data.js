// ============================================================
// Mon Budget Course — Données embarquées
// Source : Coût Sport Auto - CoutsKarting.csv + QuestionsKarting.csv
// Aucun serveur requis : ce fichier est chargé via <script>
// ============================================================

window.COSTS_DATA = [
  // ── Karting ────────────────────────────────────────────────
  {
    key: "karting_neuf_haut",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Karting SODIKART NEUF PRÊT À ROULER",
    prix: 8500,
    source: "Prix public"
  },
  {
    key: "karting_neuf_occasion_haut",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Karting quasi-neuf (2h de roulage) de la finale mondiale",
    prix: 6600,
    source: "Devis des teams (GKart53, Itakashop…)"
  },
  {
    key: "karting_occasion",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Basique",
    description: "Karting d'occasion chez un revendeur spécialisé",
    prix: 3000,
    source: "Prix observé chez revendeur spécialisé"
  },

  // ── Chariot ────────────────────────────────────────────────
  {
    key: "chariot_basic",
    categorie: "Matériel",
    souscategorie: "Transport",
    gamme: "Basique",
    description: "Chariot kart MEKAONE",
    prix: 199.90,
    source: "https://www.itakashop.com/fr/chariots-kart/10591-chariot-kart-mekaone.html"
  },
  {
    key: "chariot_premium",
    categorie: "Matériel",
    souscategorie: "Transport",
    gamme: "Haut de gamme",
    description: "Chariot kart basculant MEKAONE",
    prix: 379.90,
    source: "https://www.itakashop.com/fr/chariots-kart/9882-chariot-kart-basculant-mekaone.html"
  },

  // ── Transport ──────────────────────────────────────────────
  {
    key: "transport_plateau",
    categorie: "Matériel",
    souscategorie: "Transport",
    gamme: "Basique",
    description: "Plateau simple (Le Bon Coin)",
    prix: 200,
    source: "Le Bon Coin"
  },
  {
    key: "transport_remorque",
    categorie: "Matériel",
    souscategorie: "Transport",
    gamme: "Haut de gamme",
    description: "Remorque",
    prix: 1000,
    source: ""
  },
  {
    key: "location_vehicule",
    categorie: "Logistique",
    souscategorie: "Transport",
    gamme: "Standard",
    description: "Location véhicule type Trafic — 3 jours",
    prix: 150,
    source: "Prix estimé"
  },

  // ── Stockage ───────────────────────────────────────────────
  {
    key: "stockage_box_basic",
    categorie: "Logistique",
    souscategorie: "",
    gamme: "Basique",
    description: "Gardiennage à l'année — petit box sur circuit",
    prix: 45,
    source: "Facture confidentielle (mensuel × 12)"
  },
  {
    key: "stockage_box_premium",
    categorie: "Logistique",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Gardiennage à l'année — grand box sur circuit",
    prix: 55,
    source: "Facture confidentielle (mensuel × 12)"
  },

  // ── Administratif ──────────────────────────────────────────
  {
    key: "droit_piste",
    categorie: "Services",
    souscategorie: "",
    gamme: "Standard",
    description: "Droit de piste à l'année",
    prix: 300,
    source: ""
  },
  {
    key: "licence_ffsa_nnck",
    categorie: "Administratif",
    souscategorie: "",
    gamme: "Standard",
    description: "Licence FFSA NNCK",
    prix: 179,
    source: ""
  },
  {
    key: "licence_ffsa_necchk",
    categorie: "Administratif",
    souscategorie: "",
    gamme: "Basique",
    description: "Licence FFSA NECCHK",
    prix: 109,
    source: ""
  },

  // ── Révision ───────────────────────────────────────────────
  {
    key: "revision_annuelle",
    categorie: "Matériel",
    souscategorie: "Maintenance",
    gamme: "Haut de gamme",
    description: "Révision annuelle complète (compétition)",
    prix: 990,
    source: "Devis confidentiel"
  },

  // ── Casque ─────────────────────────────────────────────────
  {
    key: "casque_basic",
    categorie: "Équipement",
    souscategorie: "",
    gamme: "Basique",
    description: "Casque ZAMP RZ-38",
    prix: 329,
    source: "https://www.itakashop.com/fr/casques-competition/13553-7534-casque-zamp-rz-38-xs.html"
  },
  {
    key: "casque_premium",
    categorie: "Équipement",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Casque BELL RS7-K",
    prix: 744,
    source: "https://www.itakashop.com/fr/casques-competition/13293-7340-casque-bell-rs7-k-fia-8878-2024.html"
  },

  // ── Combinaison ────────────────────────────────────────────
  {
    key: "combinaison_basic",
    categorie: "Équipement",
    souscategorie: "",
    gamme: "Basique",
    description: "Combinaison BOX'S BKX Grise",
    prix: 179,
    source: "https://www.itakashop.com/fr/combinaisons-homologuees-fia/13060-7058-combinaison-boxs-bkx-grise.html"
  },
  {
    key: "combinaison_premium",
    categorie: "Équipement",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Combinaison officielle SODI OMP",
    prix: 519,
    source: "https://www.itakashop.com/fr/combinaisons-homologuees-fia/12894-6937-combinaison-officielle-sodi-omp.html"
  },

  // ── Gants ──────────────────────────────────────────────────
  {
    key: "gants_basic",
    categorie: "Équipement",
    souscategorie: "",
    gamme: "Basique",
    description: "Gants Alpinestars Tech 1-K Race V2 Pure",
    prix: 44.95,
    source: "https://www.itakashop.com/fr/gants/13244-7254-gants-alpinestars-tech-1-k-race-v2-pure.html"
  },
  {
    key: "gants_premium",
    categorie: "Équipement",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Gants Alpinestars Tech 1-KX V4 (FIA 8877-2022)",
    prix: 119,
    source: "https://www.itakashop.com/fr/gants-homologues-fia/13291-7326-gants-alpinestars-tech-1-kx-v4-fia-8877-2022.html"
  },

  // ── Manomètre ──────────────────────────────────────────────
  {
    key: "manometre_basic",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Basique",
    description: "Manomètre de pression digitale GT2i Race & Safety",
    prix: 29.90,
    source: "https://www.gt2i.com/fr/autres-outils/158439-manometre-de-pression-digitale-gt2i-race-safety-3661768827802.html"
  },
  {
    key: "manometre_premium",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Manomètre digital ROTAX",
    prix: 289.10,
    source: "https://www.itakashop.com/fr/manometres/1978-manometre-digital-rotax.html"
  },

  // ── Outillage ──────────────────────────────────────────────
  {
    key: "outils_basic",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Basique",
    description: "Kit outillage karting (fait manuellement)",
    prix: 200,
    source: ""
  },
  {
    key: "outils_premium",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Kit outillage karting parc fermé",
    prix: 394.80,
    source: "https://www.itakashop.com/fr/outillage-kart-divers/12728-kit-outillage-karting-parc-ferme.html"
  },
  {
    key: "decolleuse_pneus",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Standard",
    description: "Pack décolleuse + ciseaux pneu Karting Cobra",
    prix: 99.99,
    source: "https://magickart.eu/fr/accessoires-pneu/6293-pack-decolleuse-et-ciseaux-pneu-karting-cobra-offert-demonte-obus-3000000042489.html"
  },

  // ── Gonfleur ───────────────────────────────────────────────
  {
    key: "gonfleur",
    categorie: "Matériel",
    souscategorie: "",
    gamme: "Basique",
    description: "Gonfleur kart",
    prix: 50,
    source: "Estimation"
  },

  // ── Mécano ─────────────────────────────────────────────────
  {
    key: "mecano_ami",
    categorie: "Services",
    souscategorie: "",
    gamme: "Basique",
    description: "Mécano journée — ami bénévole",
    prix: 0,
    source: ""
  },
  {
    key: "mecano_pro",
    categorie: "Services",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Tarif mécano officiel / journée",
    prix: 150,
    source: "Devis confidentiel"
  },

  // ── Courses compétition ────────────────────────────────────
  {
    key: "inscription_course_club",
    categorie: "Course",
    souscategorie: "",
    gamme: "Standard",
    description: "Inscription course club",
    prix: 150,
    source: ""
  },
  {
    key: "location_box_we",
    categorie: "Course",
    souscategorie: "",
    gamme: "Standard",
    description: "Location d'un box pour un week-end",
    prix: 60,
    source: "Box Ancenis"
  },
  {
    key: "essence_journee",
    categorie: "Course",
    souscategorie: "",
    gamme: "Standard",
    description: "Essence — 1 journée de roulage (5×10 min)",
    prix: 50,
    source: ""
  },
  {
    key: "pneus_vega_basic",
    categorie: "Course",
    souscategorie: "",
    gamme: "Basique",
    description: "1 train de pneus Vega XH4 Second Choix",
    prix: 174.99,
    source: "https://magickart.eu/fr/vega/8422-set-de-4-pneus-kart-vega-xh4-second-choix.html"
  },
  {
    key: "engagement_ligue",
    categorie: "Course",
    souscategorie: "",
    gamme: "Standard",
    description: "Engagement Ligue BPL — 4 courses 2026",
    prix: 600,
    source: "https://ligue-karting-bpl.fr/"
  },
  {
    key: "pneus_vega_ligue",
    categorie: "Course",
    souscategorie: "",
    gamme: "Standard",
    description: "1 train de pneus Vega XH4 (ligue)",
    prix: 220,
    source: "https://ligue-karting-bpl.fr/"
  },
  {
    key: "engagement_ligue_journee",
    categorie: "Course",
    souscategorie: "",
    gamme: "Standard",
    description: "Engagement ligue à la journée",
    prix: 150,
    source: "https://ligue-karting-bpl.fr/"
  },

  // ── Loisir ─────────────────────────────────────────────────
  {
    key: "sprint_location",
    categorie: "Course",
    souscategorie: "",
    gamme: "Loisir",
    description: "Sprint SWS karting de location (coût moyen)",
    prix: 75,
    source: "https://www.karting-laval.fr/course-endurance/"
  },
  {
    key: "endurance_2h",
    categorie: "Course",
    souscategorie: "",
    gamme: "Loisir",
    description: "Endurance 2H par pilote (équipe de 2)",
    prix: 100,
    source: "https://www.karting-laval.fr/course-endurance/"
  },
  {
    key: "endurance_4h",
    categorie: "Course",
    souscategorie: "",
    gamme: "Loisir",
    description: "Endurance 4H par pilote (équipe de 2)",
    prix: 220,
    source: "https://www.karting-laval.fr/course-endurance/"
  },
  {
    key: "endurance_6h",
    categorie: "Course",
    souscategorie: "",
    gamme: "Loisir",
    description: "Endurance 6H par pilote (équipe de 4)",
    prix: 167.50,
    source: "https://www.karting-laval.fr/course-endurance/"
  },
  {
    key: "endurance_12h",
    categorie: "Course",
    souscategorie: "",
    gamme: "Loisir",
    description: "Endurance 12H par pilote (équipe de 6)",
    prix: 216.67,
    source: "https://www.karting-laval.fr/course-endurance/"
  },
  {
    key: "endurance_24h",
    categorie: "Course",
    souscategorie: "",
    gamme: "Loisir",
    description: "Endurance 24H par pilote (équipe de 6)",
    prix: 431.67,
    source: "https://www.karting-laval.fr/course-endurance/"
  },
  // ── Services team compétition ─────────────────────────────────
  {
    key: "location_chassis_we",
    categorie: "Services",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Location châssis week-end (team)",
    prix: 500,
    source: "Devis team compétition (confidentiel)"
  },
  {
    key: "location_moteur_we",
    categorie: "Services",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Location moteur week-end (team)",
    prix: 500,
    source: "Devis team compétition (confidentiel)"
  },
  {
    key: "service_team_tente",
    categorie: "Services",
    souscategorie: "",
    gamme: "Haut de gamme",
    description: "Service team pro — tente, outils et mise à disposition",
    prix: 1000,
    source: "Devis team compétition (confidentiel)"
  },

  // ── Consommables maintenance ──────────────────────────────
  {
    key: "huile_motul",
    categorie: "Matériel",
    souscategorie: "Maintenance",
    gamme: "Standard",
    description: "Huile Motul Kart GP 2T",
    prix: 13.60,
    source: "https://www.itakashop.com/fr/huiles-2-temps-karting/1450-huile-motul-kart-gp-2t.html"
  },
  {
    key: "graisse_chaine",
    categorie: "Matériel",
    souscategorie: "Maintenance",
    gamme: "Standard",
    description: "Graisse à chaîne RK",
    prix: 12,
    source: "https://www.itakashop.com/fr/graisses-a-chaine-karting/1460-graisse-a-chaine-rk.html"
  },
  {
    key: "plaquettes_frein",
    categorie: "Matériel",
    souscategorie: "Maintenance",
    gamme: "Standard",
    description: "Plaquettes arrière C+ Étrier Tekneex 4 pistons D20",
    prix: 83.90,
    source: "https://www.itakashop.com/fr/plaquettes-de-freins-kart/12189-plaquettes-arriere-c-etrier-tekneex-4-pistons-d20.html"
  },
  // ── Hébergement / Paddock ──────────────────────────────────
  {
    key: "tente_paddock",
    categorie: "Logistique",
    souscategorie: "",
    gamme: "Basique",
    description: "Tente paddock 24MX Easy-Up avec cloisons",
    prix: 119,
    source: "https://www.24mx.fr/product/tente-paddock-24mx-easy-up-avec-cloisons-noire_pid-21116-18WW"
  },
  {
    key: "hotel_nuit",
    categorie: "Hébergement",
    souscategorie: "",
    gamme: "Standard",
    description: "Hébergement hôtel — nuit (estimation)",
    prix: 80,
    source: "Estimation"
  }
];

// ============================================================
// Questions structurées pour le simulateur
// type : radio | checkbox | number | select | endurance
// condition : "questionId=value" → afficher si
// prefill : "sourceId=value>cibleId=valeur" → auto-remplir si
// ============================================================

window.QUESTIONS_DATA = [
  {
    id: "profil",
    label: "Par où veux-tu commencer ?",
    hint: "Cela nous aide à adapter les questions à ton niveau.",
    type: "radio",
    options: [
      { value: "noob",    label: "Je n'y connais pas grand-chose — fais-moi une simulation économique" },
      { value: "guide",   label: "Je m'y connais un peu — guide-moi" },
      { value: "expert",  label: "Je souhaite tout personnaliser" }
    ],
    condition: null,
    prefill: null,
    defaultValue: null,
    group: "Profil"
  },
  {
    id: "pratique",
    label: "Loisir ou compétition ?",
    hint: "Tu peux cocher les deux si tu fais les deux.",
    type: "checkbox",
    options: [
      { value: "loisir",      label: "Loisir — karting de location, endurance…" },
      { value: "competition", label: "Compétition — championnat club, ligue, régional…" }
    ],
    condition: null,
    prefill: null,
    defaultValue: null,
    group: "Profil"
  },
  {
    id: "budget",
    label: "Quel est ton budget ?",
    hint: "Économique = occasion et équipement entrée de gamme. Premium = neuf et haut de gamme.",
    type: "radio",
    options: [
      { value: "economique",   label: "Économique — je veux dépenser le minimum" },
      { value: "premium",      label: "Premium — je veux le meilleur" },
      { value: "personnalise", label: "Personnalisé — je choisis poste par poste" }
    ],
    condition: "pratique=competition",
    prefill: "profil=noob>budget=economique",
    defaultValue: null,
    group: "Profil"
  },
  {
    id: "categorie",
    label: "Quelle catégorie ?",
    hint: "Les catégories sont définies par la FFSA selon l'âge.",
    type: "select",
    options: [
      { value: "senior",    label: "Senior (14 ans +)" },
      { value: "master",    label: "Master (32 ans +)" },
      { value: "mini60",    label: "Mini 60 (8–12 ans) — à venir", disabled: true },
      { value: "nationale", label: "Nationale (12–17 ans) — à venir", disabled: true },
      { value: "kz2",       label: "KZ2 — à venir", disabled: true }
    ],
    condition: "pratique=competition",
    prefill: null,
    defaultValue: null,
    group: "Profil"
  },
  {
    id: "perimetre",
    label: "Quel périmètre de compétition ?",
    hint: "Régional = championnat club + ligue. National et International à venir.",
    type: "radio",
    options: [
      { value: "regional",       label: "Régional — championnat club + ligue" },
      { value: "national",       label: "National (à venir)" },
      { value: "international",  label: "International (à venir)" }
    ],
    condition: "pratique=competition",
    prefill: "budget=economique>perimetre=regional",
    defaultValue: null,
    group: "Compétition"
  },

  // ── Questions Loisir ──────────────────────────────────────
  {
    id: "nb_courses_loisir",
    label: "Combien de sessions sprint par mois ? (× 12 = annuel)",
    hint: "Sprint = séance courte en karting de location (~15–30 min).",
    type: "number",
    min: 0,
    max: 20,
    options: null,
    condition: "pratique=loisir",
    prefill: null,
    defaultValue: 0,
    group: "Loisir"
  },
  {
    id: "endurance_loisir",
    label: "Combien d'endurances par an ?",
    hint: "Sélectionne la durée et le nombre de sessions sur l'année.",
    type: "endurance",
    options: [
      { value: "2h",  label: "2H" },
      { value: "4h",  label: "4H" },
      { value: "6h",  label: "6H" },
      { value: "12h", label: "12H" },
      { value: "24h", label: "24H" }
    ],
    condition: "pratique=loisir",
    prefill: null,
    defaultValue: null,
    group: "Loisir"
  },

  // ── Questions Compétition ─────────────────────────────────
  {
    id: "nb_courses_club",
    label: "Combien de courses club dans l'année ?",
    hint: "Courses organisées par le club local (hors ligue).",
    type: "number",
    min: 0,
    max: 30,
    options: null,
    condition: "pratique=competition",
    prefill: null,
    defaultValue: 0,
    group: "Compétition"
  },
  {
    id: "nb_courses_ligue",
    label: "Combien de courses en ligue dans l'année ?",
    hint: "Courses comptant pour le championnat régional (ligue UFOLEP, ASA…). 4 par défaut pour une saison régionale.",
    type: "number",
    min: 0,
    max: 20,
    options: null,
    condition: "pratique=competition&perimetre=regional",
    prefill: null,
    defaultValue: 4,
    group: "Compétition"
  },

  // ── Team & Matériel ─────────────────────────────────────────────────
  {
    id: "team",
    label: "Souhaites-tu rejoindre un team ?",
    hint: "Un team fournit le châssis et le moteur moyennant location. Cela évite l'achat du matériel.",
    type: "radio",
    options: [
      { value: "oui", label: "Oui — je veux intégrer un team" },
      { value: "non", label: "Non — je roule avec mon propre matériel" }
    ],
    condition: "pratique=competition&budget=premium|personnalise",
    prefill: "budget=economique>team=non",
    defaultValue: null,
    group: "Compétition"
  },
  {
    id: "karting",
    label: "As-tu déjà un karting ?",
    hint: null,
    type: "radio",
    options: [
      { value: "oui", label: "Oui — j'ai déjà un karting" },
      { value: "non", label: "Non — je dois en acheter un" }
    ],
    condition: "pratique=competition&team=non",
    prefill: null,
    defaultValue: null,
    group: "Matériel"
  },
  {
    id: "revision_moteur",
    label: "Prévois-tu une révision moteur cette année ?",
    hint: "Révision annuelle complète recommandée en compétition.",
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: "pratique=competition&karting=oui",
    prefill: "karting=non>revision_moteur=non",
    defaultValue: null,
    group: "Matériel"
  },
  {
    id: "chassis_marque",
    label: "As-tu une préférence pour la marque du châssis ?",
    hint: "Information indicative uniquement — n'influence pas le budget.",
    type: "radio",
    options: [
      { value: "sodikart",  label: "Sodikart" },
      { value: "crg",       label: "CRG" },
      { value: "tony_kart", label: "Tony Kart" },
      { value: "indifferent", label: "Peu importe" }
    ],
    condition: "pratique=competition&karting=non",
    prefill: null,
    defaultValue: null,
    group: "Matériel"
  },
  {
    id: "transport",
    label: "Comment vas-tu transporter ton matériel ?",
    hint: null,
    type: "radio",
    options: [
      { value: "location", label: "Location de véhicule" },
      { value: "remorque",  label: "Achat remorque" },
      { value: "plateau",   label: "Achat plateau" },
      { value: "deja",      label: "J'ai déjà ce qu'il faut" }
    ],
    condition: "pratique=competition&team=non",
    prefill: null,
    defaultValue: null,
    group: "Logistique"
  },
  {
    id: "stockage",
    label: "Où vas-tu stocker ton karting ?",
    hint: null,
    type: "radio",
    options: [
      { value: "box",    label: "Gardiennage dans un box sur circuit" },
      { value: "maison", label: "Je le garde chez moi" }
    ],
    condition: "pratique=competition&team=non",
    prefill: null,
    defaultValue: null,
    group: "Logistique"
  },
  {
    id: "chariot",
    label: "As-tu déjà un chariot ?",
    hint: null,
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: "pratique=competition&team=non",
    prefill: null,
    defaultValue: null,
    group: "Matériel"
  },
  {
    id: "outils",
    label: "As-tu déjà tous les outils nécessaires ?",
    hint: null,
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: "pratique=competition&team=non",
    prefill: null,
    defaultValue: null,
    group: "Matériel"
  },

  // ── Équipement ────────────────────────────────────────────
  {
    id: "casque",
    label: "As-tu déjà un casque homologué ?",
    hint: "Le casque doit être homologué pour la compétition.",
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: null,
    prefill: null,
    defaultValue: null,
    group: "Équipement"
  },
  {
    id: "combinaison",
    label: "As-tu déjà une combinaison homologuée ?",
    hint: null,
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: null,
    prefill: null,
    defaultValue: null,
    group: "Équipement"
  },
  {
    id: "gants",
    label: "As-tu déjà des gants ?",
    hint: null,
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: null,
    prefill: null,
    defaultValue: null,
    group: "Équipement"
  },
  {
    id: "manometre",
    label: "As-tu déjà un manomètre ?",
    hint: null,
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: "pratique=competition",
    prefill: null,
    defaultValue: null,
    group: "Matériel"
  },
  {
    id: "gonfleur",
    label: "As-tu déjà un gonfleur ?",
    hint: null,
    type: "radio",
    options: [
      { value: "oui", label: "Oui" },
      { value: "non", label: "Non" }
    ],
    condition: "pratique=competition",
    prefill: null,
    defaultValue: null,
    group: "Matériel"
  },

  // ── Assistance & Hébergement ──────────────────────────────
  {
    id: "mecanique",
    label: "Qui s'occupe de ta mécanique les jours de course ?",
    hint: null,
    type: "radio",
    options: [
      { value: "moi",  label: "Je fais tout moi-même" },
      { value: "ami",  label: "J'ai un ami mécano (bénévole)" },
      { value: "pro",  label: "Je paie un mécanicien officiel" }
    ],
    condition: "pratique=competition",
    prefill: null,
    defaultValue: null,
    group: "Compétition"
  },
  {
    id: "hebergement",
    label: "Prévois-tu de dormir sur place lors des week-ends de course ?",
    hint: null,
    type: "radio",
    options: [
      { value: "hotel",   label: "Oui, à l'hôtel" },
      { value: "paddock", label: "Je dors dans le paddock (camion / tente)" },
      { value: "maison",  label: "Non, je rentre chez moi" }
    ],
    condition: "pratique=competition",
    prefill: null,
    defaultValue: null,
    group: "Logistique"
  }
];
