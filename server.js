const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.static("public"));

app.get("/search", async (req, res) => {

    const query = encodeURIComponent(req.query.q || "");

    try {

        const response = await fetch(
            `https://html.duckduckgo.com/html/?q=${query}`
        );

        const html = await response.text();

        res.send(html);

    } catch(err) {

        res.status(500).send("Search failed.");

    }

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
