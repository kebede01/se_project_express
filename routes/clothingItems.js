const router = require("express").Router();

const auth = require("../middlewares/auth");
const {
  validateItemId,
  validateCreateClothingInput,
} = require("../middlewares/validation");
const {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);

router.use(auth);
router.get("/:itemId", validateItemId, getClothingItem);
router.post("/", validateCreateClothingInput, createClothingItem); // post request to /items
router.delete("/:itemId", validateItemId, deleteClothingItem);
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);
module.exports = router;
