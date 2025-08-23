const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

const errorUtils = require("../utils/errors");

const JWT_SECRET = require("../utils/config");

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');
const ConflictError  = require('../errors/conflict-err');

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(errorUtils.Successful).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorUtils.DocumentNotFoundError)
          .send({ message: "The requested resource was not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(errorUtils.BadRequestStatus)
          .send({ message: "Invalid item ID" });
      }

      return res
        .status(errorUtils.InternalServerError)
        .send({ message: "An internal server error occurred" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      }).then((user) => {
        // Convert to plain object and delete password
        const userObject = user.toObject();
        delete userObject.password;

        res.status(errorUtils.SuccessfulOperation).send({
          data: userObject,
        });
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(errorUtils.BadRequestStatus)
          .send({ message: "Check the values you provided for each field!" });
      }
      if (err.code === 11000) {
        // Duplicate key error — typically for unique fields like email
        return res
          .status(errorUtils.EmailAlreadyExists)
          .json({ message: "Email already exists." });
      }
      // Handle other errors
      return res
        .status(errorUtils.InternalServerError)
        .send({ message: "An internal server error occurred" });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id; // Get user ID from auth middleware
  const { name, avatar } = req.body; // Only allow these fields to be updated

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { name },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validation on update
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(errorUtils.DocumentNotFoundError)
          .json({ message: "User not found" });
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(errorUtils.BadRequestStatus)
          .json({ message: "Validation error" });
      }
      return res
        .status(errorUtils.InternalServerError)
        .json({ message: "Server error" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(errorUtils.BadRequestStatus)
      .send({ message: "The password and email fields are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(errorUtils.Successful).send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      if (err.message.includes("Incorrect email or password")) {
        res.status(errorUtils.UnAuthorized).send({ message: err.message });
      }
    });
};
module.exports = { updateProfile, getCurrentUser, createUser, login };
