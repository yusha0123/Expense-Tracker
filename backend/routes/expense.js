const express = require("express");
const {
  addExpense,
  getUserExpenses,
  deleteUserExpense,
} = require("../controllers/expenseController");
const protected = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protected, addExpense);
router.route("/").get(protected, getUserExpenses);
router.route("/:id").delete(protected, deleteUserExpense);

module.exports = router;
