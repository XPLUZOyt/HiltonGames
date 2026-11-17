const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/search", async (req, res) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).send("Missing search query.");
  }

  try {
    const response = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; HiltonGames/1.0; +https://github.com/XPLUZOyt/HiltonGames)",
          Accept: "text/html,application/xhtml+xml"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`DuckDuckGo responded with status ${response.status}`);
    }

    const html = await response.text();
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("Search proxy failed:", err);
    res.status(502).send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Search unavailable</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 2rem; background: #0f172a; color: white;">
          <h1>Search unavailable</h1>
          <p>The proxy could not reach the search service. Please try again in a moment.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
