const mongoose = require("mongoose");

const ResetPasswordSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresIn: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
});

const ResetPassword = mongoose.model("ResetPassword", ResetPasswordSchema);

module.exports = ResetPassword;
