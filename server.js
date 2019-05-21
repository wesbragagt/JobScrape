const express = require("express");
const PORT = process.env.PORT || 3000;
// const mongoose = require("mongoose");

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

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/jobScrape";

// Connect to MongoDB
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// template route
app.get("/", (req, res) => {
    res.render("index");
});

// -- LISTENING --
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
