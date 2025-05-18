const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,          // Email from Google profile
  password: String,       // null for Google users
});

module.exports = mongoose.model("User", userSchema);