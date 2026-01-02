Tambola Dual Screen (Option A - Host/Display)

Files:
- display.html  (public screen for TV / screen share)
- host.html     (private host control panel with preview + confirm)
- state.js      (shared state + BroadcastChannel sync)
- style.css

How to use (GitHub Pages):
1) Upload these 4 files to your GitHub repo root.
2) Enable GitHub Pages (Settings -> Pages -> Deploy from main / root).
3) Open:
   - https://<username>.github.io/<repo>/display.html   (TV)
   - https://<username>.github.io/<repo>/host.html      (host)

Important limitation:
- Option A uses BroadcastChannel + localStorage, which syncs best when both pages are opened
  in the SAME browser/device (e.g., your laptop connected to TV). It is NOT multi-device realtime sync.

Controls:
- Host panel:
  - Generate Preview -> shows the next number (private)
  - Set Override     -> type a number (1-90) to override the preview
  - Confirm & Publish -> publishes to display + grid
  - Undo Last / Reset Game

Display:
- Shows current number, last 5 sequence, full grid.

New in v2:
- Host includes Ticket Monitor for all 40 tickets (progress + preview).
- Display grid is larger and takes ~40% width.
- Added Welcome 2026 banner + Akash & Arpita™.


V2 additions:
- AI Host panel (client-side) suggests next numbers using lookahead simulation over the 40-ticket set.
- New ticket set (tickets_v2.json) generated with diversity constraints to reduce late-game clustering.
- Player tickets (ticket01.html … ticket40.html) included in this zip.
