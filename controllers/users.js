const User = require("../models/user");

const errorUtils = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(errorUtils.InternalServerError)
        .send({ message: "An internal server error occurred" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(errorUtils.BadRequestStatus)
          .send({ message: "Check the values you provided for each field!" });
      }
      return res
        .status(errorUtils.InternalServerError)
        .send({ message: "An internal server error occurred" });
    });
};

module.exports = { getUsers, getUser, createUser };
