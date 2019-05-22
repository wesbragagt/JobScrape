const mongoose = require("mongoose");

// save reference to the Schema constructor
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        require: true
    }
});

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
