# Plan : "Le Compte-Tours" — Nouvelle version du simulateur

## Objectif

Créer `version-compte-tours/` : une version esthétiquement totalement différente de `version-editorial/`, en thème clair, avec le même simulateur de budget karting fonctionnel.

---

## Fichiers à créer

```
version-compte-tours/
  index.html
  about.html
  style.css
```

**Fichiers réutilisés (chemins relatifs `../`) :**
- `../app.js` — logique simulateur identique, aucune modification
- `../data/data.js` — données embarquées
- `../img/cg.jpg`, `../img/gm.jpg`, `../img/hero.jpg`

---

## Direction artistique : Race Control / Timing Tower

**Concept** : L'interface ressemble aux écrans de chronométrage FIA / affichages pit wall. Technique, précis, data-driven. Thème clair blanc froid. L'accent orange "safety car" remplace le rouge.

### Palette CSS

```css
--bg:           #F8FAFD;   /* blanc légèrement froid */
--bg-alt:       #EEF2F8;
--surface:      #FFFFFF;
--surface-2:    #F4F7FC;
--border:       #DDE3ED;
--border-light: #E8EDF5;

--accent:       #F97316;   /* orange safety car */
--accent-dim:   #C2410C;
--accent-light: #FFF4ED;

--text:         #0D1117;   /* quasi-noir nuancé bleu */
--text-muted:   #64748B;
--text-faint:   #94A3B8;

--blue:         #1D4ED8;   /* bleu timing (bouton "auto à venir") */
```

### Typographie (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800&family=JetBrains+Mono:wght@400;500&family=Nunito+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
```

- `--font-display`: `'Exo 2', sans-serif` — titres, labels, boutons
- `--font-mono`:    `'JetBrains Mono', monospace` — montants, données
- `--font-body`:    `'Nunito Sans', sans-serif` — texte courant

### Éléments visuels distinctifs

1. **Pas d'intro overlay** (pas de feux de départ) — juste un `fadeIn` rapide au chargement
2. **Héros** : fond `--bg` avec grille SVG technique en filigrane (lignes fines #DDE3ED espacement 40px) + image hero.jpg à opacity 0.12 filtre désaturé
3. **Numéro watermark** : grand `"01"` en Exo 2 800, opacity 0.04, positionné dans le héros en décoration
4. **Bandes de timing** : au lieu des speed-lines en mouvement, des lignes horizontales fixes ultra-fines orange à gauche du héros (style splits de chrono)
5. **Cartes pilotes** : bordure gauche 3px orange + pastille circulaire photo, style "fiche de starting grid"
6. **Accent shift** : toutes les occurrences rouge `--accent: #CC1100` → orange `#F97316`
7. **Question cards** : `border-left: 3px solid var(--accent)` → orange au lieu de rouge
8. **Total hero** : `border-top: 3px solid var(--accent)` → orange
9. **Animation intro** : aucune séquence de feux. Simple `@keyframes fadeIn` sur body.

### Copywriting

| Élément | Texte |
|---|---|
| `<title>` | `Le Compte-Tours — Simulateur de budget karting` |
| Tag héros | `Édition 2026 · Karting & Auto` |
| H1 | `Le Compte-<br/><em>Tours</em>` |
| Sous-titre | `Calculez votre saison avec la précision d'un chrono. Des données de terrain, une simulation réelle.` |
| CTA principal | `Démarrer la simulation` |
| CTA auto | `Simuler en auto` + badge `À venir` |
| Lien about | `En savoir plus sur le projet →` |
| Sim h2 | `Simulation karting` |
| Sim hint | `Réponds aux questions ci-dessous, une par une. Clique sur **Calculer mon budget** une fois toutes les questions complétées.` |
| Résultats h3 | `Votre relevé de saison` |
| Total label | `Budget Année 1` |
| Footer | `Le Compte-Tours — édition 2026 · Conçu par Clément Guet & Guillaume Mas` |
| Footer note | `Les estimations sont basées sur notre expérience personnelle et les prix observés en 2025–2026. Ce simulateur n'a pas de valeur contractuelle.` |
| About title | `Le Compte-<br/><em>Tours</em>` |
| About tag | `Édition 2026 · Notre histoire` |
| About subtitle | `Derrière chaque budget maîtrisé, un pilote qui a appris à lire ses gauges.` |
| About section tag 1 | `Pourquoi ce projet` |
| About h2 | `La question que personne<br/>ne pose vraiment` |
| About section tag 2 | `Les créateurs` |
| About h2 bis | `Deux pilotes` |
| Donation title | `Vous avez votre budget.<br>Soutenez ceux qui l'ont <em>bâti</em>.` |

---

## Structure HTML index.html

Reprendre **exactement** la structure de `version-editorial/index.html` mais :

1. **Supprimer** le bloc `#intro-overlay` (div complète + script séquence feux en bas)
2. **Supprimer** les `<div class="speed-lines">` (landing + simulator)
3. **Modifier** les textes selon le tableau copywriting ci-dessus
4. **Modifier** `<link rel="stylesheet" href="style.css" />` (même nom)
5. **Modifier** `<script src="../app.js">` (même chemin)
6. **Modifier** `<script src="../data/data.js">` (même chemin)
7. **Ajouter** dans le héros un SVG décoratif watermark numéro (voir ci-dessous)
8. **Ajouter** les bandes de timing statiques (voir ci-dessous)

### SVG watermark à insérer dans `.landing-content` (avant `.landing-header`)

```html
<!-- Numéro watermark décoratif -->
<div class="hero-watermark" aria-hidden="true">01</div>
```

### Bandes de timing à insérer dans `#landing` (avant `.landing-content`)

```html
<!-- Bandes timing décoratives -->
<div class="timing-bands" aria-hidden="true">
  <div class="tb tb-1"></div>
  <div class="tb tb-2"></div>
  <div class="tb tb-3"></div>
</div>
```

---

## Structure HTML about.html

Reprendre **exactement** `version-editorial/about.html` mais :

1. Modifier les textes selon le tableau copywriting
2. Modifier le `<title>` : `À propos — Le Compte-Tours`
3. Même lien fonts Exo 2 + JetBrains Mono + Nunito Sans
4. Supprimer les `<div class="speed-lines">` dans `#about-hero`

---

## CSS style.css — Différences clés vs version-editorial

### Variables à changer

| Variable | version-editorial | version-compte-tours |
|---|---|---|
| `--bg` | `#FAF8F4` | `#F8FAFD` |
| `--bg-alt` | `#F2EFE9` | `#EEF2F8` |
| `--surface-2` | `#F7F4F0` | `#F4F7FC` |
| `--border` | `#E0DBD3` | `#DDE3ED` |
| `--border-light` | `#EDE9E3` | `#E8EDF5` |
| `--accent` | `#CC1100` | `#F97316` |
| `--accent-dim` | `#991000` | `#C2410C` |
| `--accent-light` | `#FFF0EE` | `#FFF4ED` |
| `--text` | `#1A1917` | `#0D1117` |
| `--text-muted` | `#7A756E` | `#64748B` |
| `--text-faint` | `#B0AA9F` | `#94A3B8` |
| `--font-display` | `'Barlow Condensed'` | `'Exo 2'` |
| `--font-body` | `'Barlow'` | `'Nunito Sans'` |
| `--font-mono` | `'DM Mono'` | `'JetBrains Mono'` |

### Sections CSS à SUPPRIMER (non utilisées)

- Tout le bloc `/* INTRO — FEUX DE DÉPART */` (`.intro-overlay`, `.intro-panel`, `.intro-light`, etc.)
- Les animations `speedLine` et les classes `.sl`, `.speed-lines`

### Sections CSS à AJOUTER

#### Hero watermark

```css
.hero-watermark {
  position: absolute;
  top: 50%;
  right: -0.05em;
  transform: translateY(-60%);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(12rem, 35vw, 28rem);
  line-height: 1;
  color: var(--text);
  opacity: 0.035;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
  z-index: 0;
}
```

#### Bandes de timing

```css
.timing-bands {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 1;
  pointer-events: none;
}

.tb {
  flex: 1;
}

.tb-1 { background: var(--accent); opacity: 1; }
.tb-2 { background: var(--accent); opacity: 0.4; }
.tb-3 { background: var(--accent); opacity: 0.15; }
```

#### Animation d'entrée (remplace intro overlay)

```css
@keyframes ctFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

body {
  animation: ctFadeIn 0.5s ease both;
}
```

#### Héros background — grille technique (remplace no-img pattern)

```css
.landing-hero-bg.no-img::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.6;
}
```

### Modifications de style notables

- `.landing-header h1 em` : même traitement (color: var(--accent)) → sera orange
- `.btn-primary` box-shadow : `rgba(249, 115, 22, 0.3)` au lieu de rouge
- `.btn-primary:hover` box-shadow : `rgba(249, 115, 22, 0.38)`
- `.btn-auto-soon` background : garder `#1D4ED8` (bleu timing)
- `.question-card` border-left : `3px solid var(--accent)` → orange automatiquement via variable
- `.total-hero` border-top : `3px solid var(--accent)` → orange automatiquement
- `#about-hero` : supprimer les speed-lines, ajouter les `.timing-bands` à gauche

### Section about-hero CSS

Le héros about dans la version-editorial utilise :
- `min-height: 50vh`
- Fond `var(--bg)`
- Contenu centré

Dans version-compte-tours : identique mais ajouter `.timing-bands` positionnées à gauche.

---

## Vérification finale

1. Ouvrir `version-compte-tours/index.html` dans un navigateur
2. Vérifier que les fontes Exo 2 / JetBrains Mono / Nunito Sans se chargent
3. Vérifier que `../app.js` et `../data/data.js` se chargent (ouvrir la console)
4. Tester le flux complet : questions → Calculer → résultats → gamme toggle
5. Tester le lien `about.html` ↔ `index.html`
6. Vérifier les images pilotes (`../img/cg.jpg`, `../img/gm.jpg`)
7. Vérifier responsive mobile (≤640px)
8. Comparer visuellement avec `version-editorial/index.html` : doit être clairement différent

---

## Notes importantes

- `app.js` utilise les IDs DOM suivants — **ne pas les renommer** :
  - `#questions-panel`, `#btn-calculate`, `#calculate-wrap`, `#calculate-progress-fill`, `#calculate-progress-text`
  - `#detail-table`, `#detail-tbody`, `#total-grand`, `#total-invest`, `#total-annual`
  - `#total-hero`, `#detail-section`, `.detail-fullwidth`, `.detail-hidden`
  - `#donation-overlay`, `#donation-close`, `#donation-skip`, `#btn-donate`, `#donation-amount`, `#donation-title`
  - `#tooltip`
- `app.js` attend `COSTS_DATA` et `QUESTIONS_DATA` fournis par `../data/data.js`
- La classe `.detail-hidden` est retirée par app.js quand les résultats arrivent
- Les `.gamme-switch` sont générés dynamiquement par app.js — s'assurer que le CSS les couvre
- Le tooltip est positionné en `position: fixed` par app.js
- La modale don est montrée via `hidden` attribute retiré par app.js
