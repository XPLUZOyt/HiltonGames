# HiltonGames
Hilton's official game site.

This site includes a full-screen in-page search experience. The frontend calls the local `/search` endpoint, which proxies DuckDuckGo and renders the results inside the site instead of opening a new browser tab.

Run locally:
```bash
npm install
npm start
```

Open http://localhost:3000

GitHub Pages cannot run this backend route, so this full-screen search experience requires a Node host such as Render, Railway, or a VPS for the live site.
