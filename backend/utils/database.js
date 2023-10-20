const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected!");
  } catch (error) {
    console.log("Database Connection Failed: ", error);
  }
}

module.exports = connectDb;
