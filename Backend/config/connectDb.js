const mongodb = require("mongodb");
const mongoose = require("mongoose");

const connectDb = () => {
  try {
    const uri = process.env.mongodbUri;

    return mongoose.connect(uri);
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDb;
