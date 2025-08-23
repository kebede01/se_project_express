const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

const errorUtils = require("../utils/errors");

const JWT_SECRET = require("../utils/config");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
// const UnauthorizedError = require("../errors/unauthorized-err");
const ForbiddenError = require("../errors/forbidden-err");
const ConflictError = require("../errors/conflict-err");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(errorUtils.Successful).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("User not found");
      } else if (err.name === "CastError") {
        throw new BadRequestError("Invalid user id");
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

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
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Check the values you provided for each field!")
        );
      }
      if (err.code === 11000) {
        // Duplicate key error — typically for unique fields like email
        return next(new ConflictError("Email already exists."));
      }
      // Handle other errors

      return next(err);
    });
};

const updateProfile = (req, res, next) => {
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
      res.status(errorUtils.Successful).send({
        data: user
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("The requested user was not found"));
      }
      if (err.name === " ValidationError") {
        return next(new BadRequestError("There is entry values validation error!"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required!"));
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
        return next(new ForbiddenError("The user isn't authorized to login!"));
      }
      if (err.name === " ValidationError") {
        return next(new BadRequestError("Check the values you provided for each field!"));
      }
      return next(err);
    });
};
module.exports = { updateProfile, getCurrentUser, createUser, login };
