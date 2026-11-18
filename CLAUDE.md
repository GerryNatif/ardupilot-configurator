# Claude Code — règles projet

## Leçons d'agents — à lire en tout début de session

Avant toute écriture de code, je dois lire **[_bmad-output/LESSONS-AGENTS.md](_bmad-output/LESSONS-AGENTS.md)** :
la mémoire partagée des pièges déjà rencontrés sur ce dépôt (bugs réels, mesurés, avec leur cause
et leur règle).

Ce fichier et le présent `CLAUDE.md` sont **complémentaires** : `CLAUDE.md` porte les **règles** qui
s'appliquent sans condition, `LESSONS-AGENTS.md` porte les **expériences** qui expliquent pourquoi.

| Constat | Action |
|---|---|
| Une règle d'ici n'est expliquée nulle part là-bas | Rien à faire — les deux fichiers n'ont pas le même rôle. |
| Je découvre un piège absent des deux | **Ajouter une entrée** dans `LESSONS-AGENTS.md` (§ Protocole). |
| Le piège est si structurant qu'il doit bloquer *toute* session | **Le proposer à Gerry** pour ce fichier-ci — ne jamais modifier `CLAUDE.md` sans son accord. |
| Une règle est contredite par le code réel | **Le signaler explicitement**, ne pas trancher en silence. |

---

## Ce qui fait foi — un maître par sujet

| Sujet | Maître |
|---|---|
| Règles absolues de session | `CLAUDE.md` (ce fichier) |
| Règles de code (stack, Angular, nommage, tests) | [`_bmad-output/project-context.md`](_bmad-output/project-context.md) |
| Pièges déjà rencontrés | [`_bmad-output/LESSONS-AGENTS.md`](_bmad-output/LESSONS-AGENTS.md) |
| Intention d'une feature livrée | `_bmad-output/implementation-artifacts/spec-*.md` (bloc `<frozen-after-approval>`) |
| Dette repérée hors périmètre | [`_bmad-output/implementation-artifacts/deferred-work.md`](_bmad-output/implementation-artifacts/deferred-work.md) |

`project-context.md` porte les 48 règles de code — **je ne les recopie pas ici**, je les lis là-bas.
Chacun de ces fichiers porte sa date de dernière vérification contre le code. **En cas de conflit entre
un de ces documents et le code, le code tranche** — et le conflit se signale, il ne se résout pas en
silence ([[L-003]]).

---

## La suite de tests doit COMPILER — et `npm run build` ne le dit pas

⚠️ **`npm run build` et `npm test` ne lisent pas les mêmes fichiers.** `tsconfig.app.json` ignore les
`*.spec.ts` ; `tsconfig.spec.json` ne compile qu'eux. Un import mort dans un fichier de test laisse
donc le **build vert** et fait taire la **suite entière** — pas un test rouge : zéro test exécuté,
et `npm test` qui sort en erreur de compilation ([[L-001]]).

**Règle** : avant de rendre la main, lancer **les deux**, et lire le bilan, pas la dernière ligne :

```bash
npm run build     # doit sortir 0
npm test          # doit sortir 0 ET afficher un nombre de tests non nul
```

Une suite qui ne tourne pas protège exactement autant qu'une suite absente. Écrire « zéro
régression » dans la section *Verification* d'une spec sans avoir lancé la commande, c'est signer
une vérification qui n'a pas eu lieu.

---

## Rien de généré ne se commite

`dist/`, `.angular/`, `node_modules/`, `out-tsc/` sont **ignorés**. Le hook `pre-commit` les refuse
à l'index ; si un jour il se trompe, la bonne réponse est de corriger `.gitignore`, jamais de passer
`--no-verify` pour s'en débarrasser.

**Pourquoi** : ces fichiers ont été suivis jusqu'au 2026-11-18 (62 fichiers de `dist/`, 79 de
`.angular/` dont un cache binaire de 4,7 Mo). Chaque build salissait le `git status` d'ouverture de
session, au point qu'on ne le lisait plus — or c'est là que se voient les vrais changements.

---

## Hooks — à installer une fois par clone

```bash
git config core.hooksPath .githooks
```

Deux contrôles mécaniques, dont le détail et les échappatoires sont dans leur propre docstring :

- **[.githooks/check_imports_resolve.py](.githooks/check_imports_resolve.py)** — tout import relatif
  d'un fichier stagé doit exister sur le disque. C'est le contrôle qui aurait évité [[L-001]] et
  [[L-002]].
- **[.githooks/check_no_build_artifacts.py](.githooks/check_no_build_artifacts.py)** — rien de
  généré n'entre à l'index.

Échappatoire générale : `git commit --no-verify`. Elle existe, elle se justifie dans le message.

---

## Vérification VISUELLE — pour tout ce qui touche au rendu

**Vitest ne voit ni le rendu Three.js, ni le thème SCSS, ni la mise en page.** Une suite verte ne dit
rien d'une image. Dès qu'une modification touche à ce qui s'**affiche** (éditeur 3D, thème, sidebar,
gui-box, tableaux de paramètres), un test unitaire reste obligatoire mais **ne suffit pas** :
lancer `npm start` et regarder, ou capturer l'écran.

⚠️ **Et vérifier que le témoin change vraiment** : comparer deux captures d'un état qu'on n'a pas
réellement basculé rend deux images identiques au pixel près, qu'on lit alors comme « ma modification
n'a aucun effet ».

---

## Documentation officielle avant d'employer une API

Ne jamais supposer le comportement d'une fonction à partir de ma connaissance d'entraînement — ce
dépôt est sur **Angular 21**, dont les API de signaux et le mode zoneless ont bougé vite.

| Sujet | Référence |
|---|---|
| Angular (signaux, `inject()`, standalone, zoneless) | https://angular.dev/ |
| Angular Material / CDK | https://material.angular.dev/ |
| Three.js | https://threejs.org/docs/ |
| Web Serial API | https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API |
| Paramètres ArduPilot | https://ardupilot.org/copter/docs/parameters.html |
| Messages MAVLink | https://mavlink.io/en/messages/common.html |

Citer la source (`// source: https://...`) quand la fonction employée n'est pas triviale.

---

## Commentaires WHY — un problème par ligne

Un commentaire qui justifie un choix non évident pointe **un seul problème à la fois**, formulé comme
un risque concret (« ne pas faire X, sinon Y »), suivi de sa référence de leçon :

```ts
// ⚠️ ne pas lire la valeur du store ici : le brouillon la masque (L-xxx)
```

Jamais un récit qui mélange plusieurs raisons ou cite une date d'arbitrage — ce récit vit dans la
spec ou dans `LESSONS-AGENTS.md`, pas dans le code.

---

## Commits

`type(portée): sujet` — `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`.
Le sujet **énonce le fait**, il ne décrit pas le geste : « la suite de tests compile à nouveau »
plutôt que « corrige les imports ». Le corps raconte ce qui a été mesuré, et marque ce qui n'est
**pas** confirmé.

Un commit porte **ses** fichiers : stager explicitement, jamais `git add -A`, et relire
`git diff --cached` avant de commiter.
