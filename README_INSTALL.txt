# Third Eye by EIMCTA — consolidated review package

This package is based on the `Code_jobs_mobile(8).gs` backend line, with the additive Build 0 schema foundations and the Visit Reports feature merged from the interim Build 1 work. It does not replace your live deployment until you upload/paste it yourself.

## Files

- `Code.gs` — complete Apps Script backend file. Replace the existing Apps Script code with this file's contents.
- `index.html` — dashboard shell and page markup. Replace the repository's root `index.html`.
- `styles.css` — extracted dashboard styles. Add at repository root.
- `app.js` — dashboard frontend logic. Add at repository root.
- `sw.js`, `manifest.json`, `icons/` — PWA shell and icons. Add at repository root preserving the `icons` folder.

## Install in this order

1. Make a backup copy of the existing Apps Script project and GitHub repository.
2. In Apps Script, replace the existing `Code.gs` contents with `Code.gs` from this package. Save.
3. Run `setupBuild0()` once from the Apps Script editor and approve the requested Google Sheets/Drive permissions. This creates only the additive tabs if they do not exist; it does not rename or clear existing tabs.
4. Run `authorizeAll()` once if your deployment uses invitations, Drive photos, or travel/GPS features.
5. Deploy a new Apps Script web-app version using the same deployment URL/access settings. Keep the current spreadsheet and document IDs configured at the top of `Code.gs`.
6. In the GitHub repository root, replace `index.html` and add `styles.css`, `app.js`, `sw.js`, `manifest.json`, and the `icons` folder. Commit and publish using your normal GitHub Pages workflow.
7. Open the dashboard, sign out, clear the site's old cached files (or use a private window once), sign in and review the core workflows.

## Preserved compatibility

The existing Google Sheet ID, invitation Google Doc ID, original sheet names, existing schedule columns, and legacy action names are retained. The previous GET endpoint remains in Apps Script for compatibility with older pages, but the new frontend sends authenticated data requests in POST bodies rather than putting the token in a URL.

## Implemented in this package

- Additive schema setup and audit-log foundation.
- Visit report form/feed with one report per schedule ID, required activity description and participant count, optional issue/next action fields, author/Super Admin edit checks, and optional photo upload support.
- Fix for the missing `f_cons` booking reference; booking uses the active assignee dropdown.
- Explicit zero scoring for `not-done`, `not done`, `no`, `pending`, and incomplete states.
- Correct apostrophe escaping in frontend HTML output and restore the school/proof interaction handlers.
- Schedule conflict matching by assignee email; server-side date, program, school and branch checks.
- Edit/reschedule, Cancelled status, schedule deletion, status transitions and invitation creation handlers at the backend/booking UI level.
- Hides schedule delete controls from consultants.
- Accurate proof-photo deletion confirmation (linked program status resets to Not Done).
- `Users` sheet read memoization per request, branch-scoped CRO travel reads and non-locking read-only actions.
- POST-based frontend data loading, version check, refresh pause while a modal or dirty target row is open, and hidden-tab refresh pause.
- PWA manifest/service worker/static shell caching and update notice.
- Role-scoped Needs Attention and weekly workload panels, cached server-side for five minutes.
- Server data helpers for workload and selected Needs Attention signals; missed-visit reason and notification-read endpoints.

## Important limitations before production use

This is a consolidated integration draft, not a claim that every item in the larger feature request has been fully completed or live-tested. The following still need an additional implementation/configuration pass before they can be marked complete:

- Firebase Cloud Messaging needs your Firebase web app config, VAPID key and service-account credentials stored securely in Apps Script Script Properties. No push delivery can be verified until these are configured.
- IndexedDB write queue with replay/idempotency and conflict resolution is not enabled. The PWA caches the app shell only; it does not cache private sheet data or claim offline form saves.
- Full monthly PDF/XLSX exports, complete cost-claim approval UI, device management UI, branch comparison UI, full global search UI, and complete planned-vs-actual visit analytics are not yet finished.
- The full Nepali BS 2000–2090 conversion dataset is not bundled; the existing Date (BS) column and manually entered BS dates remain supported. Do not rely on automatic BS conversion in this draft.
- Needs Attention currently derives overdue jobs, missing reports and overdue targets; stale-progress and no-visit monitoring need a validated timestamp source and complete UI.
- Closing-date email routing still needs branch/consultant-specific workflow verification, and existing triggers should be checked in Apps Script before production use.
- GPS background tracking remains subject to browser and operating-system suspension; a PWA cannot guarantee uninterrupted background GPS.

## Configuration/security notes

- Never paste Firebase service-account private keys into `app.js`, `index.html`, or GitHub. Store credentials in Apps Script Script Properties only.
- Keep Apps Script deployment access appropriate for your intended users. The application authenticates each request with its signed token; do not publish the spreadsheet itself.
- The PWA service worker intentionally does not cache POST responses, Apps Script API responses, login data, or private user records.
- After any Apps Script code change, deploy a new version; saving the editor alone does not update the existing web app deployment.

## Checks performed for this package

JavaScript syntax checks are run separately for `app.js` and `Code.gs` (the latter checked as JavaScript after copying its contents to a `.js` file). These checks do not execute Google Apps Script services and do not prove Drive, Gmail, Sheet permissions, deployment routing, GPS behavior, or Firebase delivery. Those require a review in your own Google environment.
