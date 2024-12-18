// backend main server file

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const dbConnect = require ("./db/dbConnect");
const registerRouter = require ("./routes/register");
const loginRouter = require ("./routes/login");
const PORT = process.env.PORT || 3001;
const cors = require("cors");

// connect ke database
dbConnect();
app.use(cors());
// router endpoints
app.use('/api', registerRouter);
app.use('/api', loginRouter);

app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;