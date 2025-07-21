const router = require("express").Router();

const userRouter = require("./users");

const clothRouter = require("./clothingItems");

const errorUtils = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothRouter);

// to handle non-existing routes
router.use("/", (req, res) => {
  res
    .status(errorUtils.DocumentNotFoundError)
    .send({ message: "The requested resource was not found" });
});

module.exports = router;
