const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const indexRouter = require("./routes/index");

const { createUser, login } = require("./controllers/users");

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error(err));

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
