const router = require("express").Router();

const {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// starts with /items

router.get("/", getClothingItems);
router.get("/:itemId", getClothingItem);
router.post("/", createClothingItem); // post request to /items
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
