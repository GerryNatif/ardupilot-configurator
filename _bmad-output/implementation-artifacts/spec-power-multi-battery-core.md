---
title: 'Multi-battery core — Page Alimentation'
type: 'feature'
created: '2026-06-01'
status: 'done'
baseline_commit: '3549b6979fb6d8a774c3baf33a40e6aaf4c76b83'
context:
  - '_bmad-output/project-context.md'
  - '_bmad-output/specs/spec-power-multi-battery/battery-parameters.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La page Alimentation affiche uniquement l'instance BATT_ (batterie 1) avec un jeu de 10 paramètres fixe, sans accès aux instances 2–9 ni aux paramètres communs manquants (FS_CRT_ACT, ARM_VOLT, ARM_MAH, LOW_TIMER, OPTIONS).

**Approach:** Rendre la page dynamique — un `app-param-table` (= un gui-box) par batterie configurée, intitulé "Batterie N", avec les paramètres communs + les paramètres type-spécifiques fusionnés dans une seule section réactive au type BATTX_MONITOR. Un bouton "Ajouter une alimentation" dans le title-page crée l'instance suivante disponible.

## Boundaries & Constraints

**Always:**
- Préfixe : `BATT_` pour N=1, `BATT{N}_` pour N=2–9.
- Sections construites via `ParamBuilderService.buildSection()` (pas `buildSectionSignal`) appelé à l'intérieur d'un `computed()`.
- État UI (indices localement ajoutés) via `signal()` — pas de `BehaviorSubject`.
- Toute écriture de paramètre passe par `draftSession.setChange()` via `onParameterChange()`.
- Renommer `src/assets/vehicle/` en `src/assets/data/` avant tout autre changement.
- `ChangeDetectionStrategy.OnPush` sur tous les composants modifiés.
- Nouvelles clés i18n dans `fr.json` ET `en.json` si ajout de textes UI.

**Ask First:**
- Si `buildSection()` appelé dans un computed provoque des erreurs de détection de signal Angular — HALT et demander une alternative.

**Never:**
- Modifier `ParamBuilderService`, `ParameterDraftSession`, `DroneLinkFacade`, `ParamTable` ou `GuiBox`.
- Écrire dans le store MAVLink directement (hors draft session).
- Implémenter CAP-4 (chemistry auto-fill) — différé dans deferred-work.
- Instances 10–16 (BATTA_–BATTF_).

## I/O & Edge-Case Matrix

| Scénario | État | Résultat attendu | Gestion erreur |
|----------|------|-----------------|----------------|
| Store vide / déconnecté | Aucun BATTX_MONITOR dans store | Page vide avec bouton "Ajouter" actif | — |
| 1 batterie configurée (BATT_MONITOR=4) | Store contient BATT_MONITOR=4 | 1 gui-box "Batterie 1" avec params communs + section Analogique | — |
| Changement BATT_MONITOR de 4→8 | Draft BATT_MONITOR=8 | Section Analogique disparaît, section DroneCAN apparaît dans le même gui-box | — |
| 9 batteries affichées | displayedBatteryIndices.length = 9 | Bouton "Ajouter" désactivé | — |
| Ajout batterie (index N non dans store) | locallyAddedIndices contient N | gui-box "Batterie N" visible, params indisponibles jusqu'à sauvegarde | — |
| BATT_MONITOR type inconnu (ex: 24) | BATTX_MONITOR = 24 | Seuls les params communs affichés, pas de section type-spécifique | — |

</frozen-after-approval>

## Code Map

- `src/assets/vehicle/` → `src/assets/data/` — renommer le dossier (aucune réf. TypeScript à mettre à jour)
- `src/app/pages/power/power.ts` — composant principal à réécrire
- `src/app/pages/power/power.html` — template à réécrire
- `src/app/pages/power/power.scss` — styles mineurs si nécessaire
- `src/app/pages/power/power.spec.ts` — smoke test à mettre à jour
- `src/app/components/ui/param-table/param-table.ts` — **lecture seule** (comprendre `ParamTableSection`)
- `src/app/core/parameter/param-builder/param-builder.service.ts` — **lecture seule** (utiliser `buildSection()`)
- `src/app/components/ui/title-page/title-page.ts` — **lecture seule** (bouton via `actions` input + `actionTriggered` output)

## Tasks & Acceptance

**Execution:**
- [x] Shell — renommer `src/assets/vehicle/` en `src/assets/data/` — prérequis, aucune réf. TS à mettre à jour
- [x] `src/app/pages/power/power.ts` — remplacer par la nouvelle implémentation :
  - Fonction pure `battParamName(index: number, baseName: string): string` — retourne `'BATT_' + base` pour index=1, `'BATT' + index + '_' + base` sinon
  - Fonction pure `getTypeSpecificBaseNames(monitorType: number): readonly string[]` — map monitorType → base names selon `battery-parameters.md` (types 3/4/7/8/9/10/13-19/25 ; inconnu → [])
  - Constante `BATT_COMMON_BASE_NAMES` : `['MONITOR','CAPACITY','MAX_VOLT','LOW_VOLT','CRT_VOLT','LOW_MAH','CRT_MAH','ARM_VOLT','ARM_MAH','FS_VOLTSRC','FS_LOW_ACT','FS_CRT_ACT','LOW_TIMER','OPTIONS']`
  - `private readonly locallyAddedIndices = signal<ReadonlyArray<number>>([])`
  - `readonly displayedBatteryIndices = computed(...)` — union Set de : indices store avec BATTX_MONITOR>0 + locallyAddedIndices, triés
  - `readonly canAddBattery = computed(() => this.displayedBatteryIndices().length < 9)`
  - `readonly batteryConfigs = computed(...)` — pour chaque index : résout monitorType (draft > store > 0), construit une `ParamTableSection` via `this.paramBuilder.buildSection()` + `this.withDrafts()`, titre = `'Batterie ' + index`
  - `addBattery(): void` — ajoute le prochain index disponible dans `locallyAddedIndices`
  - Conserver `logBitmaskSection` (existant, inchangé)
  - Supprimer `POWER_PARAMETER_NAMES` et `powerSectionBase` / `powerSection` (remplacés)
- [x] `src/app/pages/power/power.html` — réécrire :
  - `<app-title-page>` avec `[actions]="[{ id:'add-battery', label:'Ajouter une alimentation', disabled: !canAddBattery() }]"` et `(actionTriggered)="addBattery()"`
  - `@for (config of batteryConfigs(); track config.index)` → `<app-param-table [section]="config.section" [disabled]="!isConnected()" (valueChange)="onParameterChange($event)" />`
  - `@if (batteryConfigs().length === 0)` → message vide
  - `<app-param-table>` pour `logBitmaskSection()` (inchangé)
- [x] `src/app/pages/power/power.scss` — ajouter espacement entre les gui-boxes batterie si visuellement nécessaire
- [x] `src/app/pages/power/power.spec.ts` — mettre à jour le mock du `DroneLinkFacade` pour fournir `parameterState` avec un signal, et `parameterMetadataState` ; vérifier `should be created`

**Acceptance Criteria:**
- Given un drone connecté avec BATT_MONITOR=4, when la page Alimentation est ouverte, then un gui-box "Batterie 1" s'affiche avec les 14 params communs + les 6 params analogiques (VOLT_PIN, CURR_PIN, VOLT_MULT, AMP_PERVLT, AMP_OFFSET, VLT_OFFSET)
- Given BATT_MONITOR est changé à 8 (DroneCAN) via le select, when le changement est appliqué dans le draft, then la section analogique est remplacée par SERIAL_NUM et CURR_MULT dans le même gui-box
- Given aucune batterie configurée, when le bouton "Ajouter une alimentation" est cliqué, then un gui-box "Batterie 1" apparaît avec les params marqués comme indisponibles
- Given 9 batteries configurées, when la page est affichée, then le bouton "Ajouter une alimentation" est désactivé
- Given la page est déconnectée du drone, when la page Alimentation est ouverte, then tous les param-tables sont désactivés (`disabled=true`)

## Design Notes

**`batteryConfigs` dans un `computed` :** `ParamBuilderService.buildSection()` lit `this.link.parameterState()` (signal) et les métadonnées (signal). Appelé à l'intérieur d'un `computed`, Angular capture ces lectures automatiquement. `withDrafts()` lit `this.draftSession.draftValues()` (signal). Le computed re-évalue à chaque changement store, draft, ou metadata.

**Résolution du monitorType :**
```typescript
const draftVal = this.draftSession.draftValues()[monitorParam];
const storeVal = this.link.parameterState().byName.get(monitorParam)?.value;
const monitorType = draftVal ?? storeVal ?? 0;
```
Draft prioritaire sur le store — le changement de MONITOR est immédiatement reflété dans les sections affichées.

**Params fusionnés dans une section unique :**
```typescript
const paramNames = [
  ...BATT_COMMON_BASE_NAMES.map(b => battParamName(index, b)),
  ...getTypeSpecificBaseNames(monitorType).map(b => battParamName(index, b)),
];
```
MONITOR est le premier param → premier champ dans le gui-box.

## Verification

**Commands:**
- `npm test` — expected: tous les tests passent (zéro régression)
- `npm run build` — expected: build sans erreur, budget initial < 2.6 MB

**Manual checks:**
- Démarrer `npm start`, naviguer vers Alimentation sans drone connecté : page vide avec bouton "Ajouter" actif
- Cliquer "Ajouter" : gui-box "Batterie 1" visible, params indisponibles
- Connecter un drone avec BATT_MONITOR=4 : section Analogique visible ; changer MONITOR→8 : section DroneCAN apparaît immédiatement

## Suggested Review Order

**Logique réactive principale**

- Point d'entrée : préfixe, params communs, mapping type → params type-spécifiques
  [`power.ts:14`](../../src/app/pages/power/power.ts#L14)

- `batteryConfigs` computed — fusion common+type, résolution monitorType draft-first
  [`power.ts:98`](../../src/app/pages/power/power.ts#L98)

- `displayedBatteryIndices` computed — union store>0 + locallyAdded
  [`power.ts:80`](../../src/app/pages/power/power.ts#L80)

**Interaction utilisateur**

- `addBattery()` — guard + ajout index dans signal local
  [`power.ts:159`](../../src/app/pages/power/power.ts#L159)

- Template : @for, action guard sur actionTriggered, état vide
  [`power.html:1`](../../src/app/pages/power/power.html#L1)

**Périphériques**

- Spec test : mock DroneLinkFacade, provideRouter, detectChanges
  [`power.spec.ts:1`](../../src/app/pages/power/power.spec.ts#L1)
