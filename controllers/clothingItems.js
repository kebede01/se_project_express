const ClothingItem = require("../models/clothingItem");

const errorUtils = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(errorUtils.Successful).send({ data: items });
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
  return (
    ClothingItem.findById(itemId)
      // .orFail()
      .then((item) => {
        res.status(errorUtils.Successful).send({ data: item });
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
      })
  );
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(errorUtils.SuccessfulOperation).send({ data: item });
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
  const userId = req.user._id; // the currently logged in user's id
  const { itemId } = req.params; // the id of the item which we are attempting to delete
  // we should only allow an item to be deleted if the current user's id is equal to the owner property of the item
  ClothingItem.findById(itemId)
    .orFail()
    .then((itemData) => {
      if (userId.toString() === itemData.owner.toString()) {
        return ClothingItem.findByIdAndDelete(itemId)
          .orFail()
          .then(() => {
            res
              .status(errorUtils.Successful)
              .send({ data: "Item deleted successfully" });
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
      }
      return res
        .status(errorUtils.NotAuthorized)
        .send({ message: "The user isn't authorized to delete this item" });
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
  // look up the clothing item that has itemId => once we get that item, then we can compare the owner property of that item to the userId
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((like) => res.status(errorUtils.Successful).send({ data: like }))
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
    .then((item) => {
      res.status(errorUtils.Successful).send({ data: item });
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
