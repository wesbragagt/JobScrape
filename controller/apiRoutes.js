const cheerio = require("cheerio");
const axios = require("axios");
module.exports = function(app, db) {
    app.get("/scrape/indeed", (req, res) => {
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
                        link: $(element)
                        .children("a")
                        .attr("href")
                    .replace(/\s+/g, " ")
                    }
                    

                    db.Jobs.create(post).then((dbJob)=>{
                        console.log(dbJob);
                    }).catch((err)=>{
                        console.log(err);
                    })
                });
                res.redirect("/");
            });
    });
};
