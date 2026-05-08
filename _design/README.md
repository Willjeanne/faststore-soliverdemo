# Dossier `_design/`

Ce dossier contient les références visuelles utilisées par l'agent IA pour le theming et les overrides.

## Contexte

Repo de **test FastStore** sur le compte `franceretail` (Bricolage/Outillage).
Les références visuelles ici sont actuellement génériques pour apprendre le process.
Quand on passera sur le repo `soliverdemo`, on remplira ce dossier avec les vrais screenshots du site s.Oliver.

## Structure recommandée
_design/
├── README.md                    ← ce fichier
├── screenshots/                 ← captures du site cible
│   ├── home.png
│   ├── plp.png
│   ├── pdp.png
│   ├── product-card.png
│   ├── header.png
│   └── footer.png
├── tokens/                      ← extraction de la charte
│   ├── colors.md                ← palette en hex codes
│   ├── typography.md            ← polices, tailles, line-heights
│   └── spacing.md               ← espacements, radii, shadows
└── claude-design-export/        ← exports HTML/PDF de Claude Design

## Comment l'agent IA doit utiliser ce dossier

Quand on lui demande de styler un composant, l'agent doit :
1. Lire les fichiers de `tokens/` pour récupérer les bonnes valeurs
2. Regarder le screenshot pertinent dans `screenshots/`
3. S'inspirer des patterns visuels de `claude-design-export/` si pertinent
4. Traduire ça en design tokens FastStore et CSS Modules
5. Ne jamais hardcoder une valeur — toujours via tokens

## Workflow d'extraction d'une charte (à faire manuellement)

### Étape 1 — Screenshots
Va sur le site cible, capture full-page de :
- Homepage (desktop ET mobile si possible)
- Page de listing produits (PLP)
- Page produit (PDP)
- Zoom sur un product card (avec hover si possible)
- Header et footer en détail

Place tout dans `_design/screenshots/`.

### Étape 2 — Tokens (via DevTools navigateur)
- **Couleurs** : inspecteur → identifie les couleurs principales (primary, accent, text, bg) → liste-les en hex
- **Typographies** : inspecteur → noms des polices, tailles utilisées pour h1/h2/h3/body
- **Espacements et radii** : border-radius des boutons et cards, ombres, paddings clés

Place dans `_design/tokens/colors.md` et `_design/tokens/typography.md`.

### Étape 3 — Claude Design (optionnel mais puissant)
Va sur Claude.ai → Claude Design.
Uploade les screenshots de l'étape 1.
Demande-lui de générer un design system + des mockups HTML.
Exporte le résultat (HTML/PDF) → place-le dans `_design/claude-design-export/`.

## Pour ce repo de test (franceretail)

Pas de site cible précis pour l'instant — on apprend les patterns FastStore.
Si tu veux tester un theming, tu peux soit :
- Choisir un site quelconque (ex: une marque que tu apprécies) et faire l'exercice complet
- Utiliser le thème `soft-blue` fourni en exemple dans la doc FastStore

Le vrai exercice "réplication d'un design existant" se fera sur le repo `soliverdemo`.