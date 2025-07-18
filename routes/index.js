const router = require("express").Router();

const userRouter = require("./users");

const clothRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothRouter);

module.exports = router;
