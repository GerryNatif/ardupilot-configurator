---
title: 'Chemistry auto-fill — Page Alimentation'
type: 'feature'
created: '2026-06-01'
status: 'done'
baseline_commit: '25db8e5da9f91bcf6bf5ec8af2bd4f02e5aec194'
context:
  - '_bmad-output/project-context.md'
  - '_bmad-output/specs/spec-power-multi-battery/battery-chemistries.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Configurer les seuils de tension d'un moniteur de batterie (MAX_VOLT, LOW_VOLT, CRT_VOLT, ARM_VOLT) nécessite de calculer manuellement valeur_par_cellule × nombre_cellules, source d'erreurs fréquentes.

**Approach:** Afficher un sélecteur chimie + nombre de cellules au-dessus de chaque gui-box batterie dont le type mesure la tension (BATT_MONITOR = 3, 4 ou 25). La sélection déclenche un calcul et remplit immédiatement les 4 champs de tension dans la draft session.

## Boundaries & Constraints

**Always:**
- Données chimies chargées depuis `src/assets/data/battery-chemistries.json` via import statique TypeScript (`resolveJsonModule: true` à ajouter dans `tsconfig.json`).
- Calcul : `valeur_par_cellule × cellCount`, arrondi à 2 décimales.
- L'auto-fill n'écrase que les 4 params de tension (MAX_VOLT, LOW_VOLT, CRT_VOLT, ARM_VOLT) ; les autres paramètres sont inchangés.
- L'auto-fill écrit dans la draft session via `onParameterChange()` — pas d'écriture directe dans le store.
- Types déclenchant le sélecteur : BATT_MONITOR = 3 (Analog V only), 4 (Analog V+I), 25 (Synthetic).
- `batteryConfigs` doit exposer `monitorType` dans chaque config pour que le template puisse conditionner l'affichage.
- `ChangeDetectionStrategy.OnPush` conservé.

**Ask First:**
- Si `resolveJsonModule` dans `tsconfig.json` provoque des erreurs de build — HALT.

**Never:**
- Modifier `ParamBuilderService`, `ParameterDraftSession`, `DroneLinkFacade`, `ParamTable`, `GuiBox`.
- Écrire dans le store MAVLink directement.
- Écraser une valeur modifiée manuellement *après* une sélection chimie — l'auto-fill ne s'applique qu'au moment de la sélection.
- Chimies personnalisées (JSON fixe, pas d'édition UI).

## I/O & Edge-Case Matrix

| Scénario | Entrée | Résultat attendu |
|----------|--------|-----------------|
| MONITOR = 4, sélection LiPo 4S | chemId=lipo, cellCount=4 | MAX=16.80, LOW=14.80, CRT=14.00, ARM=15.40 dans le draft |
| Sélection chimie sans cellCount (= 1S par défaut) | chemId=lipo, cellCount=1 | Calcul effectué avec cellCount=1 |
| Changement cellCount sans chimie sélectionnée | cellCount=6, chemId='' | Aucun auto-fill déclenché |
| MONITOR = 8 (DroneCAN) | — | Sélecteur chimie non affiché |
| MONITOR = 0 | — | Sélecteur chimie non affiché |

</frozen-after-approval>

## Code Map

- `tsconfig.json` — ajouter `resolveJsonModule: true`
- `src/assets/data/battery-chemistries.json` — créer avec les 4 chimies (LiPo, Li-Ion, LiFe, NiMH)
- `src/app/pages/power/power.ts` — ajouter import JSON, interface, logique auto-fill, state selectors
- `src/app/pages/power/power.html` — ajouter sélecteur chimie/cellules conditionnel par batterie
- `src/app/pages/power/power.scss` — styles `.chemistry-selector`
- `_bmad-output/specs/spec-power-multi-battery/battery-chemistries.md` — **référence** (schéma + valeurs)

## Tasks & Acceptance

**Execution:**
- [x] `tsconfig.json` — ajouter `"resolveJsonModule": true` dans `compilerOptions`
- [x] `src/assets/data/battery-chemistries.json` — créer avec les 4 chimies du schéma `battery-chemistries.md`
- [x] `src/app/pages/power/power.ts` — modifications :
  - Ajouter import : `import CHEMISTRY_DATA from '../../../assets/data/battery-chemistries.json'`
  - Déclarer interface `BatteryChemistry` et constante `CHEMISTRIES: ReadonlyArray<BatteryChemistry>`
  - Constante `CELL_COUNTS = Array.from({ length: 14 }, (_, i) => i + 1)` (1 à 14)
  - Méthode `isVoltageMeasurementType(monitorType: number): boolean` — retourne `true` pour 3, 4, 25
  - Signals privés `selectedChemistries = signal<Record<number, string>>({})` et `selectedCellCounts = signal<Record<number, number>>({})`
  - Propriétés readonly exposées au template : `readonly chemistries = CHEMISTRIES`, `readonly cellCounts = CELL_COUNTS`
  - Helpers template : `getSelectedChemistry(index): string` et `getSelectedCellCount(index): number`
  - Méthodes publiques `onChemistryChange(index, chemistryId)` et `onCellCountChange(index, cellCount)` — mettent à jour le signal puis appellent `applyChemistryFill` si les deux valeurs sont présentes
  - Méthode privée `applyChemistryFill(index, chemistryId, cellCount)` — calcule et appelle `onParameterChange` pour MAX_VOLT, LOW_VOLT, CRT_VOLT, ARM_VOLT
  - Mettre à jour `batteryConfigs` pour retourner `{ index, section, monitorType }` (ajouter `monitorType` dans l'objet retourné)
- [x] `src/app/pages/power/power.html` — dans le `@for`, avant `<app-param-table>`, ajouter :
  ```
  @if (isVoltageMeasurementType(config.monitorType)) {
    <div class="chemistry-selector">
      <select #chemSelect (change)="onChemistryChange(config.index, chemSelect.value)">
        <option value="">— Chimie —</option>
        @for (c of chemistries; track c.id) { <option [value]="c.id">{{ c.name }}</option> }
      </select>
      <select #cellSelect (change)="onCellCountChange(config.index, +cellSelect.value)">
        @for (n of cellCounts; track n) { <option [value]="n">{{ n }}S</option> }
      </select>
    </div>
  }
  ```
- [x] `src/app/pages/power/power.scss` — ajouter `.chemistry-selector` : `display: flex; gap: 0.5rem; margin-bottom: 0.5rem` avec `&__select` : apparence cohérente avec le thème (`background: var(--surface-100); border: 1px solid var(--surface-400); border-radius: 0.25rem`)

**Acceptance Criteria:**
- Given BATT_MONITOR = 4, when LiPo + 4S est sélectionné, then MAX_VOLT = 16.80, LOW_VOLT = 14.80, CRT_VOLT = 14.00, ARM_VOLT = 15.40 apparaissent dans les champs correspondants (valeurs draft)
- Given BATT_MONITOR = 8 (DroneCAN), when la batterie est affichée, then aucun sélecteur chimie n'est visible
- Given une chimie sélectionnée, when le nombre de cellules change, then les 4 champs de tension sont recalculés immédiatement
- Given les 4 champs de tension ont été remplis via auto-fill, when l'utilisateur modifie manuellement MAX_VOLT ensuite, then la valeur manuelle est conservée (l'auto-fill ne se redéclenche pas)

## Design Notes

**Import JSON statique :** `import CHEMISTRY_DATA from '../../../assets/data/battery-chemistries.json'` retourne un tableau inféré. Caster vers `ReadonlyArray<BatteryChemistry>` pour le typage strict.

**`onParameterChange` réutilisé :** `applyChemistryFill` appelle `this.onParameterChange({ name, value })` — même chemin que les changements manuels dans `ParamTable`. Cohérent avec le pattern existant.

## Verification

**Commands:**
- `npm run build` — expected: build sans erreur TypeScript
- `npm test` — expected: zéro régression (smoke test Power toujours vert)

**Manual checks:**
- Naviguer vers Alimentation, ajouter une batterie, sélectionner MONITOR = 4 : sélecteur chimie visible
- Choisir LiPo + 4S : champs MAX_VOLT/LOW_VOLT/CRT_VOLT/ARM_VOLT remplis avec 16.80/14.80/14.00/15.40
- Changer pour 6S : valeurs recalculées (16.80→25.20, 14.80→22.20, 14.00→21.00, 15.40→23.10)
- Changer MONITOR → 8 : sélecteur chimie disparaît
