const express = require("express");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const path = require("path");
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

// --- MIDDLEWARE FOR LOADING FILES ---
app.use(express.static(path.join(__dirname, "/public")));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/jobScrape";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
});

// Require routes
// HOME PAGE ROUTE
app.get("/", (req, res) => {
    db.Job.find({})
        .then(dbJobs => {
            res.render("index", { jobs: dbJobs });
        })
        .catch();
});
app.get("/scrape/indeed", (req, res) => {
    axios
        .get("https://www.indeed.com/jobs?q=developer&l=Nashville%2C+TN")
        .then(response => {
            const $ = cheerio.load(response.data);

            $("div.title").each(function(i, element) {
                const post = {
                    title: $(element)
                        .children()
                        .text()
                        .replace(/\s+/g, " "),
                    company: $(element)
                        .next()
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
            res.redirect("/");
        });
});

app.get("/scrape/monster", (req, res) => {
    axios
        .get(
            "https://www.monster.com/jobs/search/?q=developer&where=Nashville__2C-TN"
        )
        .then(response => {
            const $ = cheerio.load(response.data);

            $("section.card-content").each(function(i, element) {
                const post = {
                    title: $(element)
                        .find("h2")
                        .text()
                        .replace(/\s+/g, " "),
                    company: $(element)
                        .find("div.company")
                        .text()
                        .replace(/\s+/g, " "),
                    link: $(element)
                        .find("a")
                        .attr("href")
                };
                // console.log($(element).find("h2").text().replace(/\s+/g, " "));

                db.Job.create(post)
                    .then(dbJob => {
                        console.log(dbJob);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            res.redirect("/");
        });
});
app.get("/scrape/glassdoor", (req, res) => {
    axios
        .get(
            "https://www.glassdoor.com/Job/jobs.htm?suggestCount=0&suggestChosen=false&clickSource=searchBtn&typedKeyword=developer&sc.keyword=developer&locT=C&locId=1144541&jobType="
        )
        .then(response => {
            const $ = cheerio.load(response.data);

            $("li.jl").each(function(i, element) {
                const post = {
                    title: $(element)
                        .find(".titleContainer")
                        .text()
                        .replace(/\s+/g, " "),
                    company: $(element)
                        .find("div.empLoc")
                        .text()
                        .replace(/\s+/g, " "),
                    link: (function() {
                        const concatLink =
                            "https://glassdoor.com" +
                            $(element)
                                .find("a")
                                .attr("href");
                        return concatLink;
                    })()
                };
                // console.log($(element).find("h2").text().replace(/\s+/g, " "));

                db.Job.create(post)
                    .then(dbJob => {
                        console.log(dbJob);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            res.redirect("/");
        });
});

// route for getting all the jobs
app.get("/jobs", (req, res) => {
    db.Job.find({})
        .then(dbJob => {
            res.json(dbJob);
        })
        .catch(err => {
            console.log(err);
        });
});

// route for getting a specific job post
app.get("/jobs/:id", (req, res) => {
    db.Job.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbJob => res.json(dbJob))
        .catch(err => res.json(err));
});

// route for posting notes to job post selected
app.post("/jobs/:id", (req, res) => {
    console.log(req.body);
    console.log(req.params);
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Job.findOneAndUpdate(
                { _id: req.params.id },
                { note: dbNote._id },
                { new: true }
            );
        })
        .then(dbJob => {
            res.json(dbJob);
        })
        .catch(err => res.json(err));
});

app.get("/deleteAll", (req, res) => {
    db.Job.deleteMany({}).then(dbJob => {
        res.send("database deleted");
    });
    res.redirect("/");
});

// -- LISTENING --
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
