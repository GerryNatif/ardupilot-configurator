# Deferred Work

Issues identified during review but not caused by this change — pre-existing tech debt.

## From: refactor-navigation-sidebar (2026-05-30)

- ~~**`'error'` LinkStatus unhandled in connection button**~~ — **CORRIGÉ le 2026-11-18** ([[L-004]]) : `isLinkActive()` exclut désormais `'error'`, et `connect()` l'émet à nouveau sur les cinq échecs techniques. Le diagnostic d'origine était juste, et il était plus grave que noté : `'error'` n'était plus émis du tout. Texte d'origine ci-dessous.
- **`'error'` LinkStatus unhandled in connection button** — `isLinkActive()` returns `true` for `'error'` status, showing "Déconnecter" when port actually failed. Same behavior as original header.ts. Fix: extend `isLinkActive` to exclude `'error'`, or handle `'error'` state explicitly in UI.

- **`selectedBaud` stale after `tryAutoConnect` / `rebootAutopilotAndReinitialize`** — baud select shows constructor-time value, not most recent localStorage value if auto-connect updated it post-mount. Fix: read from localStorage reactively or expose `lastBaudRate` as a signal from DroneLinkFacade.

- **`App.isSidebarRevealed` plain boolean, not signal** — App component uses Default CD. Should be `signal(false)` for zoneless-safe reactivity.

- **`App` component missing `ChangeDetectionStrategy.OnPush`** — Root component defaults to Default CD. Pre-existing.

- **`SensorsStatus` missing `ChangeDetectionStrategy.OnPush`** — Component defaults to Default CD. Pre-existing.

- **`isGuardedRoute()` only matches flat routes** — Does not handle lazy-loaded children. Pre-existing limitation in app.ts.

- **Backdrop `display: none` defeats CSS opacity transition** — Sidebar backdrop has no fade-in animation because `display` toggling skips transition. Pre-existing. Fix: use `visibility`+`opacity` instead of `display`.

- **`SensorsStatus` data is hardcoded** — Sensor active/inactive state is static compile-time data, not connected to live MAVLink telemetry. Moving the component to the footer makes this more visible. Needs proper MAVLink sensor health integration.

- **`selectedBaud` value may not match `<select>` options** — If localStorage holds a non-standard baud rate, the dropdown renders blank. Low likelihood. Fix: validate and clamp to allowed values on read.

## From: power-multi-battery-core review (2026-06-01)

- **`locallyAddedIndices` non vidé au disconnect** — Les batteries ajoutées localement (non sauvegardées) restent visibles après déconnexion. Les params seront marqués "unavailable" mais les gui-boxes persistent. Fix : écouter le changement de `isConnected()` et réinitialiser `locallyAddedIndices` à `[]` lors du passage à `false`.

## From: power-chemistry-autofill review (2026-06-01)

- **Drift IEEE 754 dans `round2`** — `Math.round(v * 100) / 100` peut produire 8.39 au lieu de 8.40 pour certaines combinaisons (ex: NiMH 6S : 1.4 × 6 = 8.399999…). Fix : remplacer par `parseFloat((v * cellCount).toFixed(2))`. Impact faible (paramBuilder normalise via increment si métadonnées disponibles).

## From: power-multi-battery-core (2026-06-01)

- **CAP-4 — Chemistry preset auto-fill** — Sélecteur chimie (LiPo, Li-Ion, LiFe, NiMH) + nombre de cellules → auto-remplissage de MAX_VOLT, LOW_VOLT, CRT_VOLT, ARM_VOLT depuis `src/assets/data/battery-chemistries.json`. Visible uniquement pour les types de moniteur mesurant la tension (BATT_MONITOR = 3, 4, 25). Schéma JSON et valeurs de référence définis dans `_bmad-output/specs/spec-power-multi-battery/battery-chemistries.md`.

## From: analyse complète du dépôt (2026-11-18)

Relevés en analysant le dépôt, sans rapport avec un changement en cours. Les deux bloquants de cette
analyse (suite de tests qui ne compile pas, artefacts de build suivis) ont été **corrigés** le même
jour ; ce qui suit ne l'est pas.

- **20 composants sans `ChangeDetectionStrategy.OnPush`** — `project-context.md` l'exige « sans
  exception ». Manquants : `app`, `osd`, `rangefinder`, `blackbox`, `onboard-logging`, `accueil`,
  `help`, `led-strip`, `connection`, `gps`, `threejs-canva`, `modes`, `dashboard`, `icon-menu`,
  `vehicle-display`, `card`, `sensors-status`, `gui-box`, `title-page`. Fix : ajouter la stratégie,
  et vérifier au cas par cas que l'état lu par le gabarit est bien un signal (`App.isSidebarRevealed`
  est un booléen nu — déjà listé plus haut).

- **i18n : couverture partielle de l'interface** — 51 clés `fr` / 52 `en`. La règle « jamais de
  message en dur » tient pour les `AppError` mais pas pour les gabarits : libellés français en dur
  dans `param-table.html` (« Valeur », « Titre », « Parametre », « Description », « Non
  synchronise »), `connection.html`, `accueil.html`, `help.html`, `channel-gauge.html`,
  `vehicle-display.html`, `rtl-visualizer.html`. Fix : extraire au fil des pages touchées, pas en un
  lot — chaque extraction est une occasion de se tromper de clé.

- **`tabServos` n'existe que dans `en.json`** — clé orpheline, absente de `fr.json`. Fix : ajouter la
  traduction française, ou retirer la clé si elle ne sert plus.

- **`threejs-canva.ts` : 1207 lignes** — 10 % du code TypeScript du dépôt dans un fichier, sans
  `OnPush`, pour un seul test de fumée. Fix : extraire les responsabilités (montage de scène,
  interaction, gizmo, rendu) avant d'y ajouter quoi que ce soit.

- **Aucun test de logique sur les pages à paramètres** — `power`, `receiver`, `rtl`, `modes` n'ont
  qu'un `it('should create')`, alors que `power.ts` (261 lignes) porte la logique multi-batterie et
  l'auto-fill chimie. Préalable utile : un banc MAVLink rejouable sans drone branché, pour éprouver
  `ParamBuilderService` + `ParameterDraftSession` de bout en bout.

- **7 `console.*` résiduels dans `src/app`** — à remplacer par le chemin d'erreur applicatif
  (`AppError` + `UiErrorService`) ou à retirer.

- **Aucun lint** — pas d'ESLint configuré, donc aucune garde sur les imports inutilisés, les `any`
  implicites résiduels ou les `console.*`. Le hook `pre-commit` ne couvre que la résolution des
  imports et les artefacts générés.

- **`mavlink-browser` en CommonJS** — provoque un *optimization bailout* au build (avertissement
  « Module 'events' … is not ESM »). Sans conséquence mesurée sur la taille actuelle (1,65 Mo pour un
  budget de 2,6 Mo), à surveiller si le bundle approche la limite.
