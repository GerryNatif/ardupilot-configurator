---
title: 'Refactoring navigation — suppression du header, sidebar consolidée'
type: 'refactor'
created: '2026-05-30'
status: 'done'
baseline_commit: 'f4b1007411c0b216af8fdf85296f8d41370da4df'
context:
  - '_bmad-output/project-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le header occupe de l'espace vertical et duplique des responsabilités (logo, connexion) avec la sidebar. Le bouton firmware flasher est vestigial. La sidebar n'est pas le point d'entrée principal de l'identité de l'application ni de la connexion.

**Approach:** Supprimer le composant Header et son usage dans app-shell. Étendre la sidebar pour accueillir (de haut en bas) : logo dynamique + info firmware/version, bouton connexion pleine largeur rectangulaire arrondi (icône gauche + label), sélecteur baud (si déconnecté), puis la navigation. Déplacer les icônes d'état des capteurs dans le footer (icône seule, sans texte, visible seulement si connecté). Ajouter un bouton menu flottant en haut du workspace pour mobile.

## Boundaries & Constraints

**Always:**
- Standalone components, `ChangeDetectionStrategy.OnPush` sur tout nouveau code de composant
- `inject()` pour les dépendances, `signal()` / `computed()` pour l'état réactif
- `AppError` avec clé i18n pour toute erreur métier
- Toute la logique de connexion (toggle, baud, gestion erreur) reste identique à l'implémentation existante dans `header.ts`
- Le logo est dynamique selon `vehicleIdentity().vehicleKind` (même table de mapping que header)

**Ask First:**
- Si la sidebar a besoin d'un input `menuToggle` output pour déléguer le comportement mobile vers app — confirmer avant d'implémenter différemment

**Never:**
- NgModule, BehaviorSubject / Subject pour état UI
- Modifier le comportement de la connexion (la logique async, la gestion des erreurs webserial, le label dynamique doivent être préservés)
- Garder le composant header dans le codebase après suppression
- Ajouter le bouton firmware flasher à la nouvelle sidebar

## I/O & Edge-Case Matrix

| Scenario | État | Résultat attendu |
|----------|------|-----------------|
| Déconnecté | sidebar ouverte | Logo default, sélecteur baud visible, bouton "Connexion" (vert), items disconnectedItems |
| Connecté | sidebar ouverte | Logo véhicule, firmware+version visibles, bouton "Déconnecter" (rouge), items connectedItems, capteurs footer |
| Connexion en cours | — | Bouton en état "connecting" (jaune), désactivé pendant la tentative |
| Mobile (< 575px) | page affichée | Bouton menu flottant visible en haut-gauche du workspace, sidebar fermée par défaut |
| Mobile + sidebar ouverte | — | Drawer slide-in depuis gauche, backdrop visible, comportement inchangé |
| Annulation port WebSerial | clic connexion | Aucune erreur affichée (comportement identique header actuel) |

</frozen-after-approval>

## Code Map

- `src/app/components/ui/sidebar-navigation/sidebar-navigation.ts` — à étendre avec DroneLinkFacade, UiErrorService, FormsModule, logique connexion, logo dynamique
- `src/app/components/ui/sidebar-navigation/sidebar-navigation.html` — restructurer avec brand block, connexion, baud picker, nav
- `src/app/components/ui/sidebar-navigation/sidebar-navigation.scss` — ajouter styles brand, connect-btn, baud-picker
- `src/app/components/ui/footer-bar/footer-bar.ts` — ajouter SensorsStatus, DroneLinkFacade, signal isConnected
- `src/app/components/ui/footer-bar/footer-bar.html` — ajouter bloc capteurs conditionnel
- `src/app/components/ui/footer-bar/footer-bar.scss` — styles compacts icônes capteurs (masquer .sensor-label)
- `src/app/app.html` — retirer `<header>`, ajouter bouton menu flottant mobile dans workspace
- `src/app/app.ts` — retirer import HeaderComponent
- `src/app/app.scss` — grid-template-rows: `1fr auto` (plus de ligne header)
- `src/app/components/ui/header/header.ts` — à supprimer
- `src/app/components/ui/header/header.html` — à supprimer
- `src/app/components/ui/header/header.scss` — à supprimer
- `src/app/components/ui/header/header.spec.ts` — à supprimer

## Tasks & Acceptance

**Execution:**
- [x] `src/app/components/ui/sidebar-navigation/sidebar-navigation.ts` — injecter `DroneLinkFacade`, `UiErrorService`; importer `FormsModule`, `SensorsStatus`; ajouter `logoPaths`, `logoPath` (computed), `vehicleIdentity`, `isLinkActive`, `isConnecting`, `connectionLabel`, `selectedBaud`, `onConnectionToggle` (copier logique depuis header.ts); retirer `tab_firmware_flasher` de `disconnectedItems`
- [x] `src/app/components/ui/sidebar-navigation/sidebar-navigation.html` — ajouter en tête : `.sidebar-brand` (logo img + bloc firmware/version si connecté), `.sidebar-connect` (sélecteur baud si déconnecté + bouton pleine largeur icône-gauche/label-droite avec classes état connexion), puis `<div class="tab_container">` existant
- [x] `src/app/components/ui/sidebar-navigation/sidebar-navigation.scss` — ajouter `.sidebar-brand`, `.sidebar-brand__logo`, `.sidebar-brand__version`, `.sidebar-connect`, `.sidebar-connect__baud`, `.sidebar-connect__btn` (full-width, border-radius 0.75rem, flex, icône mask, couleurs état vert/rouge/jaune)
- [x] `src/app/components/ui/footer-bar/footer-bar.ts` — injecter `DroneLinkFacade`; importer `SensorsStatus`; exposer `isConnected = this.link.isConnected`
- [x] `src/app/components/ui/footer-bar/footer-bar.html` — ajouter `@if (isConnected()) { <app-sensors-status class="footer-sensors"> }` dans `.footer-bar`
- [x] `src/app/components/ui/footer-bar/footer-bar.scss` — ajouter `app-sensors-status.footer-sensors { .sensor-label { display: none } /* compact sizing */ }`
- [x] `src/app/app.html` — retirer `<header class="app-shell__header">...</header>`; ajouter dans `.app-shell__workspace` un `<button class="mobile-menu-btn" (click)="toggleSidebar()">` avec icône menu SVG (même technique mask que sidebar)
- [x] `src/app/app.ts` — retirer `import { Header as HeaderComponent }` et `HeaderComponent` du tableau `imports`
- [x] `src/app/app.scss` — changer `.app-shell { grid-template-rows: 1fr auto }` ; ajouter `.mobile-menu-btn` (visible uniquement `@media (max-width: 575px)`, positionné fixed ou sticky en haut du workspace, z-index > sidebar)
- [x] Supprimer `src/app/components/ui/header/header.ts`, `header.html`, `header.scss`, `header.spec.ts`

**Acceptance Criteria:**
- Étant donné l'app chargée (desktop), quand la sidebar est visible, alors le header n'apparaît pas et le logo est visible en haut de la sidebar
- Étant donné l'état déconnecté, quand l'utilisateur clique le bouton connexion dans la sidebar, alors la logique de connexion WebSerial s'exécute (identique à l'ancienne behavior du header)
- Étant donné l'état connecté, quand la sidebar affiche le mode connecté, alors le firmware, la version et le logo véhicule sont visibles; le bouton connexion est rouge "Déconnecter"
- Étant donné une fenêtre mobile (< 575px), quand la page est affichée, alors un bouton menu flottant est visible permettant d'ouvrir la sidebar drawer
- Étant donné l'état connecté, quand le footer est visible, alors les icônes de capteurs (sans texte) sont affichées

## Design Notes

**Bouton connexion pleine largeur** — s'inspirer du style existant dans la sidebar (`.sidebar-link`) mais full-width avec `border-radius: 0.75rem`. Couleurs identiques aux anciennes `.connection_button__link` classes : vert (#7bdc33→#63c826) connecté, rouge (#ff3f7a→#e8004f) déconnecté, jaune (#ffd44d→#f6c31f) connecting. L'icône (mask SVG) est positionnée à gauche via `flex + gap`.

**Footer capteurs** — réutiliser `<app-sensors-status>` tel quel; masquer `.sensor-label` via CSS encapsulé dans footer-bar.scss en ciblant le host child. Pas de modification du composant SensorsStatus.

## Verification

**Commands:**
- `npm run build` -- expected: compilation sans erreur, budget < 2.6 MB
- `npm test` -- expected: tous les tests passent (sidebar, footer specs au minimum)

**Manual checks:**
- Desktop : header absent, sidebar visible avec logo + bouton connexion + nav
- Mobile : bouton menu flottant visible, drawer fonctionne au tap
- Connexion/déconnexion fonctionne depuis la sidebar (états couleur corrects)
- Footer affiche les icônes capteurs (sans label) quand connecté
