const mongoose = require("mongoose");
const noteSchema = mongoose.Schema({
  title: String,
  content: String,
  user: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true },
    ],
  date: String,
  time: String,
});
module.exports = mongoose.model("Note", noteSchema);
