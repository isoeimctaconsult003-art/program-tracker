THIRD EYE BY EIMCTA — CONSOLIDATED FEATURE UPDATE

FILES
- Code.gs: Google Apps Script backend
- index.html: GitHub Pages frontend
- 404.html: GitHub Pages not-found page
- manifest.json, sw.js, icon.svg: installable PWA shell

BEFORE DEPLOYING
1. Make a manual copy of your Google Spreadsheet.
2. Replace the Apps Script project's Code.gs with this Code.gs and Save.
3. In Apps Script, select authorizeAll and Run it once. Approve the Google permissions. authorizeAll also runs setupBuild0(), which creates the additive feature tabs without deleting existing tabs or rows.
4. Run runPreflightChecks() and inspect the execution log. Resolve any failed checks, especially Sheet 23 and the Apps Script timezone (Asia/Kathmandu).
5. Deploy > Manage deployments > Edit > New version > Deploy. Keep Execute as: Me and access: Anyone (the setting you confirmed).
6. Replace the GitHub repository's index.html and upload 404.html, manifest.json, sw.js and icon.svg to the same repository root. Keep the API URL in index.html pointing to your current /exec deployment.
7. Open the site in a private/incognito window and test using test accounts for all roles.

FEATURES ADDED OR CONNECTED IN THIS UPDATE
- Insights & tools page: global search, needs-attention list, staff workload, branch comparison and planned/reported/GPS-verified counts.
- Notifications inbox with mark-as-read; new schedule assignments and schedule changes create in-app notifications.
- Travel cost claims: consultants submit selected trips; admin/branch admin can approve, reject or mark approved claims paid.
- Monthly report export to XLSX (when the SheetJS CDN is available) and browser print-to-PDF.
- Schedule reschedule and cancel actions; cancelled bookings no longer block a new booking.
- Schedule save uses a request ID and server-side cache to prevent repeated double-click submissions.
- Audit feed and admin backup/restore from a backup created by this deployment.
- Installable PWA shell and custom 404 page.
- Existing visit reports, route replay and saved-place functionality retained.
- Existing Nepali date text field is retained and displayed alongside the Gregorian date.

IMPORTANT LIMITATIONS / LIVE SETUP
- Nepali date field accepts manually entered BS text; this update does not implement automatic BS<->AD conversion.
- Notifications are an in-app inbox, not Firebase Cloud Messaging push. FCM requires your Firebase project configuration and authorized service-worker setup.
- The PWA caches the app shell only. It does not queue offline writes or synchronize conflicting edits.
- Google Places integration is not activated; current saved-place and map lookup behavior remains as in the existing source.
- XLSX export uses an external SheetJS CDN; if it is unavailable, the frontend falls back to CSV.
- Restore writes backup cell values into matching tabs. It does not reconstruct spreadsheet formulas, protected ranges, or permissions. Always create a fresh backup before restoring.
- New invitation documents are private. External recipients must be granted access explicitly. Run secureExistingInvitationLinks() once only if you also want to revoke anyone-with-link access on older invitation documents.
- Live Google Sheets, Drive, email, account permissions, and role workflows have not been executed from this environment. Static checks cannot certify those live services.
