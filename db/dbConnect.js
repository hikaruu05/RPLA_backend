const mongoose = require("mongoose");
require('dotenv').config()

async function dbConnect() {
  // using mongoose to connect app to database on mongoDB using the DB_URL connection string in .env file
 await mongoose
    .connect(
        process.env.DATABASE_URL,
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;