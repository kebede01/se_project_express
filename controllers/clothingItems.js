const ClothingItem = require("../models/clothingItem");

const success = require("../utils/errors");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const ForbiddenError = require("../errors/forbidden-err");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => {
      if (!items) {
        throw new NotFoundError("There are no clothing items!");
      }
      res.status(success.Successful).send({ data: items });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("The requested source was not found"));
      }
      return next(err);
    });
};

const getClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.status(success.Successful).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item id format"));
      }
      return next(err);
    });
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      if (!item) {
        throw new BadRequestError("Please! fill all the required inputs");
      }
      res.status(success.SuccessfulOperation).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidatorError") {
        return next(new BadRequestError("Validatio error"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }

      return next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const userId = req.user._id; // the currently logged in user's id
  const { itemId } = req.params; // the id of the item which we are attempting to delete
  // we should only allow an item to be deleted if the current user's id is equal to the owner property of the item
  ClothingItem.findById(itemId)
    .orFail()
    .then((itemData) => {
      if (!itemData) {
        throw new NotFoundError("The requested source was not found");
      } else if (userId.toString() === itemData.owner.toString()) {
        return ClothingItem.findByIdAndDelete(itemId)
          .orFail()
          .then(() => {
            res
              .status(success.Successful)
              .send({ data: "Item deleted successfully" });
          })
          .catch((err) => {
            if (err.name === "DocumentNotFoundError") {
              return next(
                new UnauthorizedError(
                  "The user isn't authorized to delete this item"
                )
              );
            }
            return next(err);
          });
      }

      return next(new ForbiddenError("The user is not authorized to delete"));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("The requested source was not found"));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id format entered"));
      }

      return next(err);
    });
  // look up the clothing item that has itemId => once we get that item, then we can compare the owner property of that item to the userId
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(success.Successful).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("The requested source was not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id format entered"));
      }

      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(success.Successful).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("The requested source was not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id format entered"));
      }
      return next(err);
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
