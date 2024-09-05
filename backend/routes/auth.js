const router = require("express").Router();
const {
  createUser,
  login,
  resetPassword,
  validateToken,
  changePassword,
  refreshToken,
} = require("../controllers/authController");
const protected = require("../middleware/auth");

router.route("/signup").post(createUser);
router.route("/login").post(login);
router.route("/refresh").get(protected, refreshToken)
router.route("/token").post(resetPassword);
router.route("/reset-password").get(validateToken);
router.route("/reset-password/:token").put(changePassword);

module.exports = router;
