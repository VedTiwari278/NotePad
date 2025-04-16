const mongoose = require("mongoose");
const OTPSchema = mongoose.Schema({
  title: String,
  content: String,
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  otp: String,
});
module.exports = mongoose.model("OTPstore", OTPSchema);
