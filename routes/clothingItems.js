const router = require("express").Router();

const auth = require("../middlewares/auth");
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
router.get("/:itemId", getClothingItem);
router.post("/", createClothingItem); // post request to /items
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
