const mongoose = require("mongoose");

const DownloadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Download = mongoose.model("Download", DownloadSchema);

module.exports = Download;
