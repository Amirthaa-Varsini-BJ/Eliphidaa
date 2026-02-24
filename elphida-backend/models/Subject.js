const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
	name: { type: String, required: true },
	code: String,
	credits: Number,
	semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" }
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);

