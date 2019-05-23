
module.exports = function(app) {
    app.get("/", (req, res) => {
        const jobsArray = [
            {
                title: "Front-end web developer",
                link: "https://www.indeed.com/viewjob?jk=6440392ab5f4140b&q=developer&l=Nashville%2C+TN&tk=1dbhjh3l543ki804&from=web&advn=3381122046180177&adid=292436075&sjdu=-jn3Ywo9zOA5v410CKuFqYADsrJpry7Wn6rE6Ey3j7Au8aAYFHKGaPMRdRkBQYdq3mX7czi1tGeum6lZEJ27KzDz3mEdxblBozeVpPc11Lc&acatk=1dbhjjna8430h800&pub=4a1b367933fd867b19b072952f68dceb&vjs=3"
            },
            {
                title: "Software Developer",
                link: "https://www.indeed.com/cmp/Judson-&-Company/jobs/Software-Engineer-6511d48495520d4b?sjdu=QwrRXKrqZ3CNX5W-O9jEvRFd8FQI4DEv5V74lSpSnHbgL2X1B-QpON9w_Z3cXfUzMIHMcvXIHlflzOLe9Bv4Tg&tk=1dbhjh3l543ki804&adid=290477583&vjs=3"
            }
        ]
            
        ;
        res.render("index", {jobs: jobsArray });
    });
};
