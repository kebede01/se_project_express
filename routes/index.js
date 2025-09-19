const router = require("express").Router();

const userRouter = require("./users");

const clothRouter = require("./clothingItems");

const NotFoundError = require("../errors/not-found-err");

router.use("/users", userRouter);
router.use("/items", clothRouter);
// for handling an unknown route

router.use("/", (req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;
