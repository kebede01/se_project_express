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
        .status(errorUtils.InternalSurverError)
        .send({ status: "fail", message: err.message });
    });
};

const getClothingItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    // .orFail()
    .then((item) => {
      res.status(200).send({ status: "success", data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorUtils.DocumentNotFoundError)
          .send({ status: "fail", message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(errorUtils.BadRequestStatus)
          .send({ status: "fail", message: err.message });
      }

      return res
        .status(errorUtils.InternalSurverError)
        .send({ message: err.message });
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
          .send({ message: err.message });
      }
      return res
        .status(errorUtils.InternalSurverError)
        .send({ message: err.message });
    });
};



const deleteClothingItem = (req, res) => {
  const { itemId } = req.prams;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(204).send({ data: null });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "This item doesn't exist" });
      }
      if (err.name === "CastError") {
        return res
          .status(errorUtils.BadRequestStatus)
          .send({ message: err.message });
      }
      return res
        .status(errorUtils.InternalSurverError)
        .send({ message: "Error occurred" });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((like) => res.status(200).send({ data: like }))
    .catch((err) => {
      console.error(err);
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  ).then(() => {
    res
      .status(200)
      .send({ data: null })
      .catch((err) => {
        console.error(err);
      });
  });

module.exports = {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
