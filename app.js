const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => console.log("connected to DB"))
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
