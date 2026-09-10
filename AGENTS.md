# Repository Guidelines

## Project Structure & Module Organization

This repository contains a React/Vite portfolio app in `Portfolio/`. Work from that directory for development tasks.

- `Portfolio/src/` contains application code.
- `Portfolio/src/pages/` holds route pages: `Home.jsx`, `Works.jsx`, and `Contact.jsx`.
- `Portfolio/src/components/` contains reusable UI such as `Sidebar.jsx` and `SplashCursor.jsx`.
- `Portfolio/src/layouts/` contains shared layout wrappers.
- `Portfolio/src/assets/` stores imported images, including work thumbnails in `assets/works/`.
- `Portfolio/public/` stores static files such as `icons.svg`.
- `Portfolio/dist/` is generated output; do not edit it manually.

## Build, Test, and Development Commands

Run commands from `Portfolio/`.

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint over JavaScript and JSX files.

## Coding Style & Naming Conventions

Use modern React with function components, hooks, and ES modules. Name components and page files in PascalCase, for example `AnimatedTitle.jsx`. Use CSS Modules for scoped styles with matching filenames such as `Works.jsx` and `Works.module.css`; keep global styles in `src/index.css` or `src/App.css`.

Follow the existing style: double quotes in JSX/JS imports, semicolons, and clear JSX structure. CSS class names use camelCase, for example `topSection` and `photoWrapper`. Keep animation variants near the component that uses them.

## Testing Guidelines

No automated test framework is currently configured. Before opening a pull request, run `npm run lint` and `npm run build`. For visual changes, manually check affected routes in `npm run dev`, especially `/`, `/works`, and `/contact`, across desktop and mobile widths.

If tests are added later, place them next to the related component or page using a clear pattern such as `ComponentName.test.jsx`.

## Commit & Pull Request Guidelines

Recent commits use short summaries such as `refactor of the code` and `2 works added`. Keep future messages concise, but prefer imperative wording, for example `add gallery page` or `fix mobile sidebar spacing`.

Pull requests should include a short description, testing performed, and screenshots or screen recordings for UI updates. Link related issues when available. Avoid committing generated archives such as `dist.zip` unless release work requires them.

## Security & Configuration Tips

Do not commit secrets, private keys, or local environment files. Keep dependencies updated through `package.json` and `package-lock.json`, and verify the app still builds after dependency changes.
