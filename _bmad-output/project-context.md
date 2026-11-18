---
project_name: 'ardupilot-configurator'
user_name: 'Gerry'
date: '2026-05-30'
verified_against_code: '2026-11-18'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 48
optimized_for_llm: true
---

# Project Context for AI Agents

_Ce fichier contient les règles et patterns critiques que les agents IA doivent suivre lors de l'implémentation de code dans ce projet. Focus sur les détails non-évidents que les agents pourraient manquer._

> **Vérifié contre le code le 2026-11-18.** Ce document porte les **règles de code** ; les règles
> de **session** vivent dans [`../CLAUDE.md`](../CLAUDE.md) et les pièges déjà rencontrés dans
> [`LESSONS-AGENTS.md`](LESSONS-AGENTS.md). La table « Ce qui fait foi » est dans `CLAUDE.md`.
>
> ⚠️ **En cas de conflit entre une règle d'ici et le code, le code tranche** — et le conflit se
> signale, il ne se résout pas en silence. Les écarts connus au 2026-11-18 sont listés en fin de
> document ; un chemin cité ici se vérifie avant d'être cru ([[L-003]]).

---

## Technology Stack & Versions

- Angular 21.2.x — standalone components exclusively, no NgModule
- Angular Material 21.2.x + Angular CDK 21.2.x
- TypeScript ~5.9.2 — strict mode fully enabled (see tsconfig)
- RxJS ~7.8.0
- Three.js ^0.183.2 (3D model editor feature)
- mavlink-browser ^1.5.0 (MAVLink protocol parsing)
- ngx-translate/core ^17.0.0 + http-loader ^17.0.0 (i18n)
- Vitest ^4.0.8 (unit tests — NOT Karma or Jest)
- SCSS (Angular inlineStyleLanguage)
- Node package manager: npm 11.6.1

Browser polyfill overrides:
- `crypto: false` — Web Crypto API not bundled
- `stream` aliased to `stream-browserify` (MAVLink browser compat)

Build target: ES2022, module: "preserve"

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

**Strict mode complet — toutes ces options sont actives :**
- `strict: true` — pas d'échappatoire via `any` implicite
- `noImplicitOverride` — le mot-clé `override` est obligatoire
- `noPropertyAccessFromIndexSignature` — accès par index explicite requis
- `noImplicitReturns` — toutes les branches doivent retourner
- `noFallthroughCasesInSwitch`
- `strictTemplates: true` — les templates Angular sont typés strictement

**Imports/Exports :**
- Toujours des imports nommés (pas de `import * as`)
- `isolatedModules: true` — chaque fichier est compilé indépendamment
- `importHelpers: true` — tslib utilisé, ne pas dupliquer les helpers manuellement

**Gestion d'erreurs :**
- Toujours utiliser `AppError` avec une **clé i18n** (ex: `'errors.transport.no_port_selected'`)
- JAMAIS de message d'erreur en dur dans le code — passer par les clés i18n de `src/assets/i18n/`
- Les erreurs métier sont remontées via `GlobalErrorHandlerService`, pas loggées directement

**Async/await :**
- Préférer `async/await` pour les opérations MAVLink (connect, write, etc.)
- Les méthodes retournant `Promise<void>` ne doivent pas être appelées sans `await` ou `void`

### Framework-Specific Rules (Angular)

**Composants — standalone uniquement :**
- Tous les composants sont standalone : `imports: [...]` dans le décorateur, jamais de NgModule
- `changeDetection: ChangeDetectionStrategy.OnPush` sur tous les composants sans exception
- Préfixe de sélecteur : `app-` (ex: `app-footer-bar`, `app-param-table`)
- Styles en SCSS via `styleUrl` (un seul fichier par composant)

**Injection de dépendances :**
- Préférer `inject()` dans le corps de classe plutôt que l'injection par constructeur (pattern observé dans les nouveaux fichiers comme `DroneLinkFacade`)
- Services root-level : `@Injectable({ providedIn: 'root' })`
- Exceptions : `ParameterDraftSession` fourni via `providers: [ParameterDraftSession]` au niveau page (scope composant)

**Gestion de l'état — Angular Signals :**
- Utiliser `signal()` et `computed()` pour l'état réactif — PAS `BehaviorSubject` ni `Subject` pour l'état UI
- `toSignal()` pour convertir un Observable en Signal (ex: `toSignal(this.transport.status$, { initialValue: ... })`)
- Les stores exposent leurs signaux en `readonly` (ex: `readonly state = computed(() => this.stateSig())`)
- NE PAS utiliser `ngModel` ou `[(ngModel)]` pour l'état — passer par les signaux

**RxJS / cycle de vie :**
- `takeUntilDestroyed()` pour la désinscription automatique des Observables — pas besoin de `ngOnDestroy` + `Subject`
- Les Observables de flux MAVLink (`onType$`, `incomingBytes$`, `status$`) restent des Observables (pas convertis en signaux dans les stores)

**Routing :**
- Guard `connectedGuard` sur toutes les routes nécessitant une connexion MAVLink active
- Route wildcard `'**'` redirige vers `''` (accueil)

**i18n :**
- Langues supportées : `fr` (défaut) et `en`
- Fichiers de traduction : `src/assets/i18n/fr.json` et `src/assets/i18n/en.json`
- Toujours ajouter les nouvelles clés dans **les deux fichiers**
- Utiliser le pipe `translate` dans les templates ou `TranslateService` dans les classes

### Testing Rules

**Framework : Vitest (pas Karma, pas Jest)**
- Runner : `@angular/build:unit-test` avec Vitest ^4.0.8
- Commande : `npm test`
- Les imports de test viennent de `@angular/core/testing` (TestBed, ComponentFixture) — idem que Karma, mais le runner est Vitest

**Organisation des fichiers :**
- Fichier de test colocalisé avec la source : `my-component.spec.ts` dans le même dossier que `my-component.ts`
- Nommage : `<nom-fichier>.spec.ts`

**Structure des tests de composant :**
- Utiliser `TestBed.configureTestingModule({ imports: [MonComposant], providers: [...] })`
- Mocker les dépendances de service avec `signal()` pour simuler les signaux Angular (ex: `{ provide: DroneLinkFacade, useValue: { isConnected: signal(false) } }`)
- Appeler `fixture.detectChanges()` puis `await fixture.whenStable()` après création
- Toujours fournir `provideRouter([])` si le composant utilise le router

**Services :**
- `TestBed.inject(MonService)` pour récupérer l'instance
- `TestBed.configureTestingModule({})` suffit pour les services `providedIn: 'root'`

**Niveau de couverture actuel :**
- Tests de fumée uniquement ("should be created") sur la plupart des composants/services
- Ne pas sur-spécifier les tests existants — ajouter des cas ciblés si une logique est ajoutée

### Code Quality & Style Rules

**Formatage (Prettier ^3.8.1) :**
- `printWidth: 100` — limite de ligne à 100 caractères
- `singleQuote: true` — guillemets simples en TypeScript
- Parser `angular` pour les fichiers `.html`
- Commande : `npx prettier --write .`

**Nommage des fichiers :**
- kebab-case pour tous les fichiers : `drone-link.facade.ts`, `parameter.store.ts`, `connected.guard.ts`
- PAS de suffixe `.component.ts` ou `.service.ts` — utiliser `.facade.ts`, `.store.ts`, `.guard.ts`, `.model.ts`, `.types.ts`
- Composants UI génériques : `src/app/components/ui/<nom>/<nom>.ts`
- Pages : `src/app/pages/<nom>/<nom>.ts`
- Features autonomes : `src/app/features/<nom>/...`
- Core (services, stores, modèles) : `src/app/core/<domaine>/...`

**Nommage des classes :**
- PascalCase sans suffixe de type : `ParameterStore` (pas `ParameterStoreService`), `DroneLinkFacade` (pas `DroneLinkFacadeService`)
- Exceptions acceptées : `MavlinkParserService`, `MavlinkCommandService` (nommage historique)

**Commentaires :**
- Bilinguisme fr/en dans les JSDoc existants (commentaire fr + traduction en)
- Ne pas ajouter de commentaires évidents — uniquement pour les invariants cachés ou contraintes non-évidentes
- Pas de blocs JSDoc multi-paragraphes sur les méthodes simples

**Icônes SVG :**
- Toutes les icônes sont des SVG custom dans `src/assets/icons/`
- Logos véhicules dans `src/assets/logos/`
- Ne pas importer de bibliothèques d'icônes externes (pas de Material Icons font, pas de FontAwesome)

### Development Workflow Rules

**Commandes principales :**
- `npm start` — serveur de développement (`ng serve`)
- `npm run build` — build de production
- `npm test` — tests unitaires Vitest
- `npm run watch` — build en mode watch (développement)

**Build :**
- Builder : `@angular/build:application` (pas Webpack ni Vite standalone)
- Configuration par défaut : `production`
- Budget de taille : initial max 2.6 MB, style par composant max 9 kB

**Branche principale :** `main`

**Assets statiques :**
- Fichiers publics (favicon, etc.) dans `public/` — copiés à la racine du build
- Assets applicatifs dans `src/assets/` — copiés sous `assets/` dans le build
- Ne pas mettre d'assets dans `src/` directement (hors `src/assets/`)

**Environnements :**
- Fichier d'environnement : `src/environments/environment.ts` (un seul, pas de `environment.prod.ts` séparé visible)

### Critical Don't-Miss Rules

**Anti-patterns absolus :**
- ❌ Ne JAMAIS créer de NgModule — standalone uniquement
- ❌ Ne JAMAIS utiliser `BehaviorSubject` ou `Subject` pour de l'état UI — utiliser `signal()`
- ❌ Ne JAMAIS écrire un message d'erreur en dur — toujours `new AppError('clé.i18n')`
- ❌ Ne JAMAIS omettre `changeDetection: ChangeDetectionStrategy.OnPush` sur un composant
- ❌ Ne JAMAIS interagir directement avec le transport MAVLink depuis un composant — passer par `DroneLinkFacade`
- ❌ Ne JAMAIS utiliser `takeUntil` + Subject pour la désinscription — utiliser `takeUntilDestroyed()`

**Architecture MAVLink — couches à respecter :**

```
UI (pages/components)
  └─ DroneLinkFacade          ← seul point d'entrée pour l'UI
       ├─ MavlinkCommandService   (envoi de commandes)
       ├─ ParameterStore          (état des paramètres)
       ├─ TelemetryStore          (état de la télémétrie)
       ├─ VehicleIdentityStore    (identité du véhicule)
       └─ SerialTransportService  (couche transport WebSerial)
```

Ne pas court-circuiter cette hiérarchie.

**Pages avec paramètres MAVLink :**
- Étendre `ParamPageBase` (inject automatique de `DroneLinkFacade`, `ParamBuilderService`, `ParameterDraftSession`)
- Déclarer `providers: [ParameterDraftSession]` dans le décorateur `@Component`
- Appeler `this.draftSession.start('id-unique-page')` dans le constructeur

**WebSerial API :**
- Disponible uniquement dans Chrome/Edge — pas Firefox
- La clé i18n `errors.transport.webserial_not_supported` existe pour ce cas
- `crypto: false` dans le bundle browser — ne pas utiliser `window.crypto` directement

**Données véhicule :**
- Modèles 3D et définitions de véhicules dans `src/assets/data/vehicles.json` (le dossier `assets/vehicle/` a été renommé en `assets/data/` au commit `4cde387`)
- Géométries Three.js dans `src/app/features/threejs-editor/services/geometry/`

**Paramètres MAVLink :**
- `normalizeParamId()` doit être utilisé pour normaliser les noms de paramètres reçus (trim des octets nuls)
- `ParameterDraftSession` gère les valeurs en attente côté UI — ne pas écrire directement dans le store
- `rebootRequired` dans les métadonnées doit être respecté lors de l'enregistrement

---

## Écarts connus entre ces règles et le code — relevés le 2026-11-18

Mesurés, non corrigés : la règle reste la règle, le code n'y est pas encore. Détail et pistes de
correction dans [`implementation-artifacts/deferred-work.md`](implementation-artifacts/deferred-work.md).

| Règle | Écart mesuré |
|---|---|
| `OnPush` « sur tous les composants sans exception » | **20 composants** ne l'ont pas, dont `App` (la racine), `threejs-canva`, `connection`, `gui-box`, `title-page`, `card`, `sensors-status` |
| « JAMAIS de message en dur — toujours une clé i18n » | Tient pour les `AppError`. **Pas** pour l'interface : libellés français en dur dans `param-table.html`, `connection.html`, `accueil.html`, `help.html`, `channel-gauge.html`, `vehicle-display.html`, `rtl-visualizer.html` |
| « Toujours ajouter les nouvelles clés dans les deux fichiers » | 51 clés `fr` / 52 `en` — `tabServos` n'existe que côté `en` |
| « Tests de fumée uniquement sur la plupart des composants » | Exact, et à relativiser : **25 fichiers** n'ont qu'un `it('should create')`, et aucune page à paramètres (`power`, `receiver`, `rtl`, `modes`) n'a de test de logique |

---

## Usage Guidelines

**Pour les agents IA :**
- Lire ce fichier avant d'implémenter tout code
- Respecter toutes les règles documentées
- En cas de doute, privilégier l'option la plus restrictive
- Signaler si un nouveau pattern émerge qui mériterait d'être documenté ici

**Pour les humains :**
- Maintenir ce fichier lean — uniquement les règles non-évidentes
- Mettre à jour lors d'un changement de stack technologique
- Réviser trimestriellement pour supprimer les règles devenues obsolètes

_Dernière mise à jour : 2026-05-30 — vérifié contre le code le 2026-11-18._
