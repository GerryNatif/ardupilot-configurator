# Deferred Work

Issues identified during review but not caused by this change — pre-existing tech debt.

## From: refactor-navigation-sidebar (2026-05-30)

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
