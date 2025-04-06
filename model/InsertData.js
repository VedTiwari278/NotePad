const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: String,
  content: String,
  date: String,
  time: String,
});
module.exports = mongoose.model("Note", noteSchema);
