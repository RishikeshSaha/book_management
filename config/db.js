const mongoose = require("mongoose");
require("dotenv").config();
const Connection = async () => {
  try {
    // console.log("process.env.mongoURL" +process.env.mongoURL);
    await mongoose.connect("mongodb://127.0.0.1:27017/book_management");
    console.log("Database Connected Succesfully");
  } catch (error) {
    console.log("Error: ", error.message);
  }
};
module.exports = Connection;
