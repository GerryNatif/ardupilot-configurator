# LEÇONS D'AGENTS — mémoire partagée des pièges du dépôt

> # 🔴 À FAIRE EN DÉBUT DE SESSION, AVANT TOUTE ÉCRITURE DE CODE
>
> **1. Lis ce fichier en entier.** Il contient des pièges qui ont **déjà coûté du temps** sur ce
> dépôt. Chaque entrée est un bug réel, mesuré, avec sa cause et sa règle. Ne les redécouvre pas.
>
> **2. Confronte-le à [`CLAUDE.md`](../CLAUDE.md)** — `CLAUDE.md` est le maître des **règles**, ce
> fichier celui des **expériences**. Une règle contredite par le code réel se **signale**, elle ne se
> tranche pas en silence.
>
> **3. En fin de session, avant de rendre la main :** as-tu perdu du temps sur quelque chose qu'une
> entrée ici t'aurait évité ? Si oui, écris-la. C'est le seul moyen que la prochaine session n'y
> retombe pas.

---

## Protocole de contribution

**Quand écrire une entrée.** Dès qu'un problème remplit **l'un** de ces critères :

- il a coûté plus d'un aller-retour de débogage ;
- il échoue **silencieusement** (pas d'erreur, ou une erreur qui accuse un innocent) ;
- la cause est **contre-intuitive**, ou spécifique à Angular / Three.js / Web Serial / MAVLink ;
- il a déjà été rencontré **deux fois**.

**Quand NE PAS écrire.** Bug métier ponctuel, faute de frappe, ou fait déjà couvert par `CLAUDE.md`,
une spec ou `project-context.md` — **mets un lien, ne recopie pas**.

**Format.** Une entrée = un piège. Numérotation `L-0XX`, jamais réutilisée, la plus récente en tête.
Chaque entrée porte **Symptôme** (daté), **Cause**, **Règle**, et **Preuve** — des chiffres, pas une
impression. Si la preuve manque, le dire : une hypothèse s'écrit comme une hypothèse.

**Si deux sessions écrivent ce fichier en même temps** : prendre le numéro **juste avant** d'écrire,
pas au début du travail. La règle est celle du premier commité — il garde son numéro, l'autre se
renumérote.

---

### L-003 : un chemin cité dans la doc dérive au premier renommage — et `status: complete` le fait lire comme un état courant

- **Symptôme** — 2026-11-18, analyse du dépôt. `_bmad-output/project-context.md` annonce « Modèles 3D
  et définitions de véhicules dans `src/assets/vehicle/vehicles.json` ». Ce dossier **n'existe plus** :
  le commit `4cde387` l'a renommé en `src/assets/data/`. Le document porte pourtant
  `status: 'complete'` et `rule_count: 48` — rien n'invite à le mettre en doute.
- **Cause** — le renommage était **prévu et tracé** (la spec `spec-power-multi-battery-core.md` le
  porte en prérequis coché, et note « aucune réf. TypeScript à mettre à jour »). C'était vrai pour le
  TypeScript : le seul import concerné est passé à `assets/data/`. Ce qui n'a pas été recensé, c'est
  la **prose** — un chemin cité dans un document ne lève aucune erreur de compilation quand il meurt.
- **Règle** — un document qui cite des chemins porte **sa date de vérification contre le code**, et un
  renommage de dossier se termine par un `grep` du nom **dans la doc**, pas seulement dans les
  sources. Devant une doc non datée qui décrit l'arborescence : **vérifier le chemin avant de le
  croire**, et signaler l'écart plutôt que de le corriger en passant.
- **Preuve** — `grep -rn "assets/vehicle" src _bmad-output` : 0 occurrence dans `src/`, 4 dans
  `_bmad-output/` (dont 3 dans la spec, légitimes — elle décrit le geste passé) ; 1 seule à corriger,
  `project-context.md:208`.

### L-002 : un fichier déplacé laisse sa copie derrière lui — et une copie morte d'un `@Injectable` est une arme chargée

- **Symptôme** — 2026-11-18. `src/app/core/parameter/save-param.ts` et
  `src/app/core/parameter/param-page/save-param.ts` sont identiques **octet pour octet** (`diff` muet).
  De même, `src/app/core/mavlink/services/` ne contient **qu'un** fichier : une copie exacte du
  `mavlink-session-bootstrap.service.spec.ts` rangé depuis dans `bootstrap/`.
- **Cause** — deux rangements successifs (`services/` éclaté en `bootstrap/` + `parameter/metadata/`,
  et `save-param` descendu dans `param-page/`) faits par copie puis mise à jour des imports, sans
  suppression de la source. Rien ne le signale : les deux copies compilent, et la morte n'est
  importée par personne.
- **⚠️ Pourquoi ce n'est pas qu'un fichier en trop** — `SaveParam` est un
  `@Injectable({ providedIn: 'root' })`. Deux **définitions de classe** distinctes, c'est deux
  singletons Angular distincts. Le jour où une complétion d'éditeur pointe la copie morte,
  `ParameterDraftSession` enregistre son contexte sur une instance et `SaveBtn` lit l'autre : le
  bouton « Sauvegarder » **n'apparaît jamais**, sans une erreur, sans un log, et le soupçon part sur
  la logique `dirty`. Non survenu à ce jour — les deux consommateurs visent bien
  `core/parameter/save-param`.
- **Règle** — un déplacement de fichier se fait par `git mv`, jamais par copie ; et un rangement se
  termine par `git status` **plus** une recherche du nom de base (`find src -name "<nom>.ts"`) pour
  vérifier qu'il n'en reste qu'un. Un dossier qui ne contient plus qu'un `.spec.ts` sans sa source
  est le signe d'un rangement inachevé.
- **Preuve** — `diff` des deux `save-param.ts` : aucune sortie. `grep -rn "save-param" src` : 2
  imports, tous deux vers `core/parameter/save-param`, aucun vers la copie. Corrigé le 2026-11-18
  (copies supprimées).

### L-001 : une spec qui ne compile pas fait taire TOUTE la suite — et `npm run build` reste vert

- **Symptôme** — 2026-11-18, premier lancement des tests du dépôt. `npm run build` sort **0** et
  produit un bundle de 1,65 Mo ; `npm test` sort **1** sans exécuter un seul test, sur 14 erreurs
  `TS2307: Cannot find module`. Aucun test rouge : **zéro test**. Et les trois specs livrées du dépôt
  déclarent toutes, dans leur section *Verification*, « `npm test` — expected: zéro régression ».
  La vérification avait été **écrite, jamais exécutée**.
- **Cause** — `tsconfig.app.json` **exclut** les `*.spec.ts` ; `tsconfig.spec.json` ne compile
  qu'eux (`include: ["src/**/*.spec.ts"]`). Les deux commandes ne lisent donc pas les mêmes fichiers,
  et une erreur dans un test est **invisible au build**. Deux fichiers étaient en cause :
  `drone-link.facade.spec.ts` (imports vers `../services/`, dossier disparu au rangement) et le
  doublon orphelin de `core/mavlink/services/` ([[L-002]]). Comme `tsconfig.spec.json` ramasse
  `src/**/*.spec.ts` d'un bloc, **une seule** erreur suffit à empêcher les ~40 autres fichiers de
  tourner.
- **⚠️ Le symptôme ne ressemble pas à un problème de tests** — il ressemble à un problème
  d'environnement : la sortie est une pile d'erreurs de résolution de modules, celle qu'on obtient
  aussi avec un `node_modules` absent ou désynchronisé. On est tenté de réinstaller, pas de lire les
  chemins. **Lire les chemins** : ils nomment le coupable.
- **Règle** — avant de rendre la main, lancer **`npm run build` ET `npm test`**, et lire le **bilan**
  de `npm test`, pas sa dernière ligne : un nombre de tests **nul** est un échec, pas un succès. Une
  suite qui ne tourne pas protège exactement autant qu'une suite absente. Garde mécanique posée le
  même jour : [`.githooks/check_imports_resolve.py`](../.githooks/check_imports_resolve.py) refuse à
  l'index tout fichier dont un import relatif n'existe pas sur le disque.
- **Preuve** — avant : `npm test` → exit 1, 14 erreurs, 0 test exécuté ; `npm run build` → exit 0.
  Après correction, voir le commit qui répare (bilan de la suite reporté ici).
