require('dotenv').config();
const loginRouter = require('./routes/login');
const express = require('express');
const mongoose = require('mongoose');
const registerRouter = require('./routes/register');
const db = mongoose.connection;
const PORT = process.env.PORT || 5010;
const app = express();
app.use('/api', loginRouter)
app.use('/api', registerRouter);
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('strictQuery', true);

db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));

