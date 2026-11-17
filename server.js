const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const SEARCH_TIMEOUT_MS = 12000;
const MAX_QUERY_LENGTH = 300;

app.disable("x-powered-by");
app.use(express.static(ROOT, { index: false, maxAge: "1h" }));

app.get("/", (_req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});

app.get("/search", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!query) {
    return res.status(400).json({ error: "Enter something to search for." });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return res.status(400).json({ error: `Search must be ${MAX_QUERY_LENGTH} characters or fewer.` });
  }

  try {
    const upstream = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml"
        },
        timeout: SEARCH_TIMEOUT_MS,
        size: 2 * 1024 * 1024
      }
    );

    if (!upstream.ok) {
      console.error(`DuckDuckGo search returned HTTP ${upstream.status}`);
      return res.status(502).json({ error: "The search provider is temporarily unavailable. Please try again." });
    }

    const html = await upstream.text();
    const $ = cheerio.load(html);
    const results = [];

    $(".result").each((_index, element) => {
      const result = $(element);
      const titleLink = result.find("a.result__a").first();
      const title = titleLink.text().trim();
      let url = titleLink.attr("href");
      const snippet = result.find(".result__snippet").text().trim();

      if (!title || !url) return;
      try {
        const resolved = new URL(url, "https://html.duckduckgo.com");
        const redirect = resolved.searchParams.get("uddg");
        if (redirect) url = redirect;
        const safeUrl = new URL(url);
        if (safeUrl.protocol !== "https:" && safeUrl.protocol !== "http:") return;
        results.push({ title, url: safeUrl.href, snippet });
      } catch {
        // Ignore malformed or non-web result links.
      }
    });

    res.set("Cache-Control", "no-store").json({ query, results });
  } catch (error) {
    console.error("Search request failed:", error.message);
    const timedOut = error.type === "request-timeout";
    res.status(502).json({
      error: timedOut
        ? "The search provider took too long to respond. Please try again."
        : "Could not reach the search provider. Please try again shortly."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HiltonGames is listening on port ${PORT}`);
});
