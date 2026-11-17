# HiltonGames
Hilton's official game site.

## GitHub Pages

This site is static and can be served by GitHub Pages. The search form sends the query directly to DuckDuckGo and opens the results in a new tab, so it does not require `localhost`, Node.js, or a backend proxy.

After enabling GitHub Pages for the repository, the site is available at:

https://xpluzoyt.github.io/HiltonGames/

## Run the optional Express server locally

```bash
npm install
npm start
```

Then open http://localhost:3000. The `/search` endpoint is only available while this local Node server (or another deployed Node host) is running; GitHub Pages cannot run Express servers.
