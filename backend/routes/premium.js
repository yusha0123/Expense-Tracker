const router = require("express").Router();
const {
  createOrder,
  verifyOrder,
  leaderboard,
  getReport,
  downloadExpenses,
  getUserDownloads,
} = require("../controllers/premiumController");
const protected = require("../middleware/auth");
const verifyPremium = require("../middleware/premium");

router.use(protected);

router.route("/create-order").get(createOrder);
router.route("/verify-order").post(verifyOrder);
router.route("/leaderboard").get(verifyPremium, leaderboard);
router.route("/report").get(verifyPremium, getReport);
router.route("/report/download").post(verifyPremium, downloadExpenses);
router.route("/report/download-history").get(verifyPremium, getUserDownloads);

module.exports = router;
