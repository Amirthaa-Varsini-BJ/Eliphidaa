const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  streak: { type: Number, default: 0 },
  lastVisit: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);