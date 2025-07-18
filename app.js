const express = require("express");

const mongoose = require("mongoose");

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error(err));

// imagine we make a POST request to /items

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6879f4c92061bfac4ae0c2c7", // paste the _id of the test user: in this case me.
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
