const mongoose = require("mongoose");

// save reference to the Schema constructor
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    link: {
        type: String,
        require: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref:"Note"
    }
});

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
