const router = require("express").Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUserId, updateProfileInput  } = require("../middlewares/validation");

router.use(auth);
router.get("/me",validateUserId, getCurrentUser);

router.patch("/me", updateProfileInput, updateProfile);

module.exports = router;
