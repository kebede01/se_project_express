const ClothingItem = require("../models/clothingItem");

const errorUtils = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      console.error(err);

      return res
        .status(errorUtils.InternalServerError)
        .send({ message: "An internal server error occurred" });
    });
};

const getClothingItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    // .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);

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

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
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

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(200).send({ data: null });
    })
    .catch((err) => {
      console.error(err);

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

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((like) => res.status(200).send({ data: like }))
    .catch((err) => {
      console.error(err);

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

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then(() => {
      res.status(200).send({ data: null });
    })
    .catch((err) => {
      console.error(err);

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

module.exports = {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
