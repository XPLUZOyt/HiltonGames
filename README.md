# HiltonGames
Hilton's official game site, served by Node.js.

## Run and deploy

The project includes an Express server that serves `index.html` and a `/search` API. Search results are parsed on the server and rendered in a fullscreen overlay on the same page.

```bash
npm install
npm start
```

Open `http://localhost:3000` for local testing. For a live deployment, run this project on your Node.js host, set its start command to `npm start`, and configure the host to route public web traffic to the assigned `PORT`. The application binds to `0.0.0.0` and uses the platform-provided port.

GitHub Pages is static hosting and cannot run this backend. Use the URL of your Node.js host for the live site (or configure your domain to point to that host), not the GitHub Pages URL.
