const express = require("express");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

// -- MODELS --

// --- INITIALIZE EXPRESS ---
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");

//--- EXPRESS PARSER ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//--- HANDLEBARS ENGINE ---
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/jobScrape";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Require routes
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/api/scrapeJobs", (req, res) => {
    axios
        .get("https://www.indeed.com/jobs?q=developer&l=Nashville%2C+TN")
        .then(response => {
            const $ = cheerio.load(response.data);

            const jobs = [];

            $("div.sjcl").each(function(i, element) {
                var companies = $(element)
                    .children()
                    .text()
                    .replace(/\s+/g, " ");

                var link = $(element)
                    .find("a")
                    .attr("href");
                jobs.push(companies, link);
            });
            res.json(jobs);
        });
});

// -- LISTENING --
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
