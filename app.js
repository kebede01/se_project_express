const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const { errors } = require("celebrate");

const { validateUserSignUp, validateUserSignIn } = require("./middlewares/validation");
const indexRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { createUser, login } = require("./controllers/users");

const errorHandler = require('./middlewares/error-handler');

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error(err));

app.use(requestLogger);
// celebrate error handler included as middleware
app.post("/signin", validateUserSignIn, login);
app.post("/signup", validateUserSignUp, createUser);

app.use("/", indexRouter);
app.use(errorLogger);
// celebrate error handler
app.use(errors());
// our centralized handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
