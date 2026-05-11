# CLAUDE.md

> Ce fichier est lu automatiquement par Claude Code (terminal et desktop) et par Cursor.
> Il fournit le contexte permanent du projet.

## Qui je suis et ce que je fais

Je suis **Solution Engineer chez VTEX** (william.jeanne@vtex.com).
Je comprends le code mais je ne suis pas développeur — je vais te demander d'exécuter, et de m'expliquer ce que tu fais en termes simples avant chaque modification importante.

## Contexte de ce projet

Ce repo est le **support de la démo s.Oliver** sur le compte VTEX `soliverdemo`.

Le prospect est **s.Oliver** — marque de mode lifestyle allemande. On utilise le thème `lala-berlin` (éditorial mode/lifestyle) qui colle au positionnement s.Oliver. Les tokens couleur/typo pourront être adaptés aux codes brand s.Oliver plus tard.

Le site n'est **pas en production réelle** — il est utilisé par moi et d'autres SE VTEX uniquement pour des démos. Pas de end-customers, pas de risque transactionnel.

J'utilise ce repo pour :
- VTEX FastStore (Next.js + `@faststore/core`)
- Les overrides de composants
- Le theming par design tokens (thème `lala-berlin`)
- Le workflow IA (Cursor + Claude Code + MCP VTEX + Skills)

## Stack technique

- **Compte VTEX** : `soliverdemo` (catalogue s.Oliver)
- **Live preview** : https://soliverdemo.vtex.app (créé au 1er deploy WebOps)
- **Repo GitHub** : https://github.com/Willjeanne/faststore-soliverdemo
- **Admin VTEX** : https://soliverdemo.myvtex.com/admin
- **Storefront** : VTEX FastStore (Next.js 13.5 + React 18 + TypeScript 5.3)
- **CLI** : `@faststore/cli` 3.98.4
- **Locale** : fr-FR, EUR, Sales channel 1
- **Theming** : SCSS + design tokens FastStore (variables `--fs-*`), thème `lala-berlin`
- **Customisation** : Overrides API FastStore (`src/components/overrides/`, `src/components/sections/`)
- **CMS** : Headless CMS VTEX (sync via `yarn cms-sync`)
- **Hébergement** : FastStore WebOps (déploiement auto sur push GitHub vers `main`)

## Périmètre de ce repo

**Ce qu'on couvre ici** :
1. Override **ProductCard** avec les patterns FastStore corrects
2. PLP (Product Listing Page) — ProductGrid, filtres
3. PDP (Product Details Page) — ProductDetails section
4. Theming global (couleurs, typo, radii) via design tokens
5. **Tunnel checkout fonctionnel jusqu'à "Order placed"** (cf. section "Pattern checkout" ci-dessous)
6. Sections custom pour la démo s.Oliver (cf. section "Composants custom" ci-dessous)

**Hors scope ici** : B2B, marketplace, headless CMS avancé, paiement custom.

## Pattern checkout adopté

Le tunnel checkout passe par `soliverdemo.myvtex.com` (et **pas** par le subdomain mutualisé `secure.vtexfaststore.com`). Cf. `discovery.config.js` : double bloc "Production URLs" (le 2nd écrase le 1er via JS).

- `secureSubdomain` + `checkoutUrl` → toujours `soliverdemo.myvtex.com`
- `loginUrl` + `accountUrl` → `myvtex.com` en dev, `vtex.app` en prod

**Compromis assumé** : pendant le tunnel, l'URL change de `soliverdemo.vtex.app` vers `soliverdemo.myvtex.com`. Entre la page paiement et "Order placed", VTEX peut demander un re-login admin → OK pour la démo.

Pattern emprunté au compte de référence `demomarkets` (qui marche bout-en-bout). Ne pas remettre `secure.vtexfaststore.com` sans avoir fait enregistrer soliverdemo dans l'infra FastStore secure côté VTEX.

## Composants custom

*(À compléter au fur et à mesure des chantiers)*

| Composant | Chemin | Description | CMS-pilotable |
|-----------|--------|-------------|---------------|
| `LookbookGrid` | `src/components/sections/LookbookGrid/` | 3 cellules éditoriales côte à côte, image + titre + CTA | ✅ |
| `InstagramFeed` | `src/components/sections/InstagramFeed/` | Section "GET INSPIRED" — grille 3-6 images carrées, icône Instagram en overlay au hover, liens vers posts | ✅ |
| `FullWidthShelf` | `src/components/sections/FullWidthShelf/` | Carousel produits pleine largeur, hover image-swap (2 photos par produit), flèches nav, données via Catalog Portal API | ✅ |
| `HeroBanner` | `src/components/sections/HeroBanner/` | Image pleine largeur (85vh), titre/sous-titre/CTA en overlay, 9 positions de texte, overlay réglable, image mobile optionnelle | ✅ |

**FullWidthShelf — détails techniques** :
- Utilise l'API Catalog Portal (`/api/catalog_system/pub/products/search`) — pas l'IS API (indexation soliverdemo incomplète)
- Le proxy Next.js (`rewrites` dans `discovery.config.js`) est indispensable en local pour contourner le CORS — redémarrer `yarn dev` si 404
- Mapping slug → ID catégorie : `{ clothes: 2, accessories: 8, bags: 9, coats: 3, dresses: 7, pants: 5, shirts: 6, sweatwear: 4 }`
- Props CMS : `title` (optionnel), `categorySlug` (string), `count` (4 | 8 | 12)
- Retourne `null` silencieusement si aucun produit → vérifier l'onglet Network si le composant n'apparaît pas

**Idées en cours** :
- Page éditoriale brand story / lookbook interactif
- PDP enrichie (size guide, sticky add-to-cart)

## Décisions d'architecture

*(À compléter au fur et à mesure)*

| Date | Décision | Raison | Alternatives écartées |
|------|----------|--------|----------------------|
| 2026-05-08 | Thème `lala-berlin` conservé | Look éditorial mode/lifestyle adapté au positionnement s.Oliver | Nouveau thème from scratch (trop long) |
| 2026-05-08 | Pattern checkout via `myvtex.com` | Seul pattern fonctionnel bout-en-bout sur comptes demo | `secure.vtexfaststore.com` (nécessite enregistrement infra) |
| 2026-05-08 | FullWidthShelf via Catalog Portal API | IS pas encore indexée sur soliverdemo → `/api/catalog_system/pub/products/search` seul disponible | IS API (`/_v/api/intelligent-search/...`) → 400 timeout |
| 2026-05-08 | Sections sans override `__experimentalProductCard` | Évite l'impact analytics IS — chaque section gère son propre rendu de carte | Override global (impacte toutes les PLP/PDP) |
| 2026-05-11 | Checkout CSS via admin code editor (pas checkout-ui-settings) | Plus simple pour la démo — `vtex.checkout-ui-settings` désinstallé car bloquait l'éditeur admin | checkout-ui-settings (nécessite workflow VTEX IO deploy) |
| 2026-05-11 | Order Placed via `faststore-vtex-integrations` app | Pattern officiel FastStore pour intégrer la page de confirmation | vtex.order-placed seul (ne s'affiche pas sans store-theme qui le déclare) |

## Workarounds

| Workaround | Détail |
|-----------|--------|
| `vtex.checkout-ui-settings` désinstallé | L'app bloquait l'éditeur admin checkout — désinstallée via `vtex uninstall vtex.checkout-ui-settings`. Le CSS est maintenant dans `checkout6-custom.css` via l'admin. |
| `vtex-checkout-confirmation` template | Revenu au contenu YAML d'origine (`vtex_io: app_name: checkout-confirmation-ui`). Notre HTML custom avait été mis par erreur et empêchait le chargement des JS custom. |
| Mini cart z-index — `section-cart-sidebar` | `section.section-cart-sidebar` n'avait pas de stacking context → le SlideOver (position:fixed) peignait sous la navbar sticky (z-index:2). Fix dans `src/themes/lala-berlin.scss` (règle globale hors `@layer`) : `.section-cart-sidebar { position: relative; z-index: 500 }` + `[data-fs-slide-over] { top: 0 !important }`. |
| Prix $US (cookie stale) | Pas de bug code — la Trade Policy a été configurée USD au départ puis changée en EUR. Les anciens visiteurs ont un cookie de session USD en cache. Fix : ouvrir un onglet privé ou effacer les cookies `soliverdemo.vtex.app`. Les nouveaux visiteurs voient EUR directement. |

## Checkout — état actuel (2026-05-11)

**CSS appliqué** (`checkout6-custom.css` dans l'admin) :
- Polices DM Sans + Cormorant Garamond chargées via Google Fonts
- Boutons (`btn-success`, `btn-go`) : `#161925`, border-radius 0, uppercase
- Inputs : border `#494949`, focus `#161925`, border-radius 0
- Fond blanc, accents lala-berlin

**Logo checkout** (`checkout-header` template dans l'admin) :
- Logo s.Oliver → `https://soliverdemo.vtexassets.com/assets/vtex.file-manager-graphql/images/df54979d-a4e8-4846-9456-82d6777b577d___eb1e82ce86b600d8efbf18941447d087.png`
- Lien → `https://soliverdemo.vtex.app/`

**Order Placed** :
- App `soliverdemo.store-theme@2.3.1` déployée depuis `~/Documents/faststore-vtex-integrations/`
- Dépendance `vtex.order-placed@2.x` déclarée dans le manifest
- Promu en master via `vtex workspace promote`
- Logo dans `store/blocks/header.jsonc` → logo lala-berlin (SVG local asset)
- Page accessible : `soliverdemo.myvtex.com/checkout/orderPlaced?og=XXX`

## TODOs ouverts

- [ ] Attendre fin d'indexation Intelligent Search (lancée — Store Settings > IS > Integrations)
- [ ] Vérifier la recherche sur soliverdemo.vtex.app une fois l'indexation terminée
- [ ] Supprimer un des deux Cross Selling Shelves sur la PDP (IS sans trafic réel → produits quasi-identiques sur les deux shelves)
- [ ] Créer le repo `faststore-se-starter` (starter kit SE — voir plan dans la mémoire Claude)

## Règles de code

### Toujours
- Sections custom dans `src/components/sections/`
- Registration dans `src/components/index.tsx`
- Overrides dans `src/components/overrides/` avec préfixe `Custom`
- Utiliser **CSS Modules** (`*.module.scss`) pour les styles spécifiques aux overrides
- Tokens du thème `lala-berlin` — jamais de hardcode couleur/typo/spacing
- Content schema CMS si la section doit être éditoriale (pilotable depuis l'admin)
- Importer les styles UI FastStore avant les overrides

### Jamais
- Ne **pas** modifier `node_modules/` ni `@faststore/core` directement
- Ne **pas** hardcoder de couleurs, espacements, ou typographies — toujours via tokens `--fs-*`
- Ne **pas** override `__experimentalProductCard` ou `SearchInput` sans avertir (impact analytics Intelligent Search)
- Ne **pas** créer de composants en dehors de `src/components/`
- Ne **pas** push directement sur `main` — toujours créer une branche + PR + squash merge

## Workflow attendu pour chaque tâche

1. **Comprendre** : lire les fichiers concernés et expliquer en 2-3 phrases ce qui va être fait
2. **Vérifier la doc** : utiliser le MCP `vtex-developer` (`search_documentation`, `fetch_document`) si doute sur l'API ou un pattern
3. **Plan en 5 lignes** avant tout override long → attendre OK avant de coder
4. **Implémenter** : faire les modifications minimales nécessaires
5. **Tester en local** : dire quoi vérifier dans le navigateur (`http://localhost:3000`)
6. **Expliquer** : résumer ce qui a changé et pourquoi
7. **Mettre à jour CLAUDE.md** après chaque chantier significatif

## Commandes utiles

- `yarn dev` — Démarrer le dev server (hot reload sur localhost:3000)
- `yarn build` — Build de prod
- `yarn cms-sync` — Sync du CMS Headless
- `yarn generate` — Régénérer les types après modification de fragment GraphQL

## Outils IA disponibles

- **VTEX Developer MCP** (`@vtex/developer-mcp`) — recherche live dans la doc et les API VTEX
- **VTEX Skills** (tracks `faststore`, `headless`, `architecture`) — patterns et contraintes plateforme
- **Frontend Design skill** (Anthropic) — qualité visuelle des composants générés

## Style de communication

- Réponds en **français**
- Pas de jargon dev sans explication courte
- Si hésitation entre 2 approches, exposer les options brièvement et proposer une recommandation
- Si une commande peut casser quelque chose (push, deploy, suppression), demander confirmation avant
- Pour les feedbacks visuels, accepter les screenshots et comparer avec le code
- Pour les diffs longs, indiquer sur quel fichier précis cliquer dans Cursor pour relire
