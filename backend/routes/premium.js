const express = require("express");
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

const router = express.Router();

router.route("/create-order").get(protected, createOrder);
router.route("/verify-order").post(protected, verifyOrder);
router.route("/leaderboard").get(protected, verifyPremium, leaderboard);
router.route("/report").get(protected, verifyPremium, getReport);
router
  .route("/report/download")
  .post(protected, verifyPremium, downloadExpenses);
router
  .route("/report/download-history")
  .get(protected, verifyPremium, getUserDownloads);

module.exports = router;
