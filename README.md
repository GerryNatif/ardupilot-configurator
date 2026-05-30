# ArdupilotConfigurator

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Add Page

This guide explains how to:
- Add a new page
- Add a new menu item
- Link the menu item to the page

### 1. Add a new page

Use the following Angular CLI command to generate a new page:

```bash
ng generate component pages/page-name
```

Replace `page-name` with your desired name. This will create a folder with the necessary files in `src/app/pages/`.

### 2. Add a new menu item

To display the page in the menu, add a new object to the menu configuration (usually in a navigation component or service, e.g., `sidebar-navigation`).

Example:

```ts
{
  label: 'Page Name',
  route: '/page-name',
  icon: 'icon_name' // optional
}
```

### 3. Link the menu item to the page

Make sure the route for the new page is declared in the routes file (e.g., `app.routes.ts`):

```ts
{
  path: 'page-name',
  component: PageNameComponent
}
```

Ensure the menu uses the `route` property for navigation (e.g., `[routerLink]="menuItem.route"`).

---

After these steps, the new page will be accessible via the menu and properly linked.
