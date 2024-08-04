const router = require("express").Router();
const {
  createUser,
  login,
  resetPassword,
  validateToken,
  changePassword,
} = require("../controllers/authController");

router.route("/signup").post(createUser);
router.route("/login").post(login);
router.route("/token").post(resetPassword);
router.route("/reset-password").get(validateToken);
router.route("/reset-password/:token").put(changePassword);

module.exports = router;
