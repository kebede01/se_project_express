const router = require("express").Router();

const { getUsers, getUser, createUser } = require("../controllers/users");

// start with /users

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser); // POST to /users

module.exports = router;
