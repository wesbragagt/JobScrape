const cheerio = require("cheerio");
const axios = require("axios");
module.exports = function(app) {
    app.get("/api/scrapeJobs", (req, res) => {
        axios
            .get("https://www.indeed.com/jobs?q=developer&l=Nashville%2C+TN")
            .then(response => {
                const $ = cheerio.load(response.data);

                const jobs = [];

                $("div.sjcl").each(function(i, element) {
                    const scrapeContent = $(element)
                    .children()
                    .text()
                    .replace(/\s+/g, " ");

                    

                    const companies = {
                        title: scrapeContent,
                        link: $(element)
                        .find("a")
                        .attr("href")
                    }
                    

                    
                    jobs.push(companies);
                });
                res.json(jobs);
            });
    });
};
