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
        .status(errorUtils.InternalSurverError)
        .send({ message: err.message });
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
          .send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(errorUtils.BadRequestStatus)
          .send({ message: err.message });
      }

      return res
        .status(errorUtils.InternalSurverError)
        .send({ message: err.message });
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
          .send({ status: "fail", message: err.message });
      }
      return res
        .status(errorUtils.InternalSurverError)
        .send({ status: "fail", message: err.message });
    });
};

module.exports = { getUsers, getUser, createUser };
