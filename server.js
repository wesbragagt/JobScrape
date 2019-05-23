const express = require("express");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");

// -- MODELS --

// --- INITIALIZE EXPRESS ---
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");

// MODELS
const db = require("./models");

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
app.get("/scrape", (req, res) => {
    axios
        .get("https://www.indeed.com/jobs?q=developer&l=Nashville%2C+TN")
        .then(response => {
            const $ = cheerio.load(response.data);

            const jobs = [];
            $("div.title").each(function(i, element) {
                const post = {
                    id: i,
                    title: $(element)
                        .children()
                        .text()
                        .replace(/\s+/g, " "),
                    link: (function() {
                        const concatLink =
                            "https://indeed.com" +
                            $(element)
                                .children("a")
                                .attr("href")
                                .replace(/\s+/g, " ");
                        return concatLink;
                    })()
                };

                db.Job.create(post)
                    .then(dbJob => {
                        console.log(dbJob);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            res.send("scrape complete");
        });
});

app.get("/jobs", (req, res) => {
    db.Job.find({})
        .then(dbJob => {
            res.json(dbJob);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/deleteAll", (req, res)=>{
    db.Job.remove({}).then(dbJob=>{
        res.send("database deleted");
    })
})

app.get("/", (req, res) => {
    db.Job.find({})
        .then(dbJobs => {
            res.render("index", { jobs: dbJobs });
        })
        .catch();
});

// -- LISTENING --
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
