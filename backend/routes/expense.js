const router = require("express").Router();
const {
  addExpense,
  getUserExpenses,
  deleteUserExpense,
} = require("../controllers/expenseController");
const protected = require("../middleware/auth");

router.use(protected);

router.route("/").post(addExpense);
router.route("/").get(getUserExpenses);
router.route("/:id").delete(deleteUserExpense);

module.exports = router;
