# Third Eye by EIMCTA

GitHub Pages frontend for the Third Eye program-tracking dashboard.

## Live application

https://isoeimctaconsult003-art.github.io/program-tracker/

## Active frontend files

- `index.html` — dashboard interface and frontend logic.
- `styles.css` — dashboard styles.
- `sw.js` — service worker and app-shell cache.
- `manifest.json` — installable web app metadata.
- `icon.svg` and `logo.jpg` — application branding.
- `404.html` — GitHub Pages not-found page.

## Backend

The dashboard communicates with a Google Apps Script web-app deployment. The deployment URL is configured in `index.html`. Backend code and Google Sheet data are managed separately in Google Apps Script and Google Sheets.

## Deployment notes

GitHub Pages serves the repository root. Keep the active frontend files above in the root directory. Test sign-in and core workflows after changing either the frontend or backend.

Do not commit passwords, session tokens, private credentials, or service-account keys to this repository.
