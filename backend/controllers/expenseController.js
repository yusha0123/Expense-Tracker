const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");

const addExpense = asyncHandler(async (req, res, next) => {
  const { amount, category, description } = req.body;
  if (!amount || !category || !description) {
    res.status(400);
    throw new Error("All fields are Mandatory!");
  }
  const t = await sequelize.transaction();
  try {
    await req.user.createExpense(
      {
        amount: amount,
        category: category,
        description: description,
      },
      {
        transaction: t,
      }
    );
    const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
    await User.update(
      {
        totalExpenses,
      },
      {
        where: {
          _id: req.user._id,
        },
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).json({
      success: true,
      messsage: "Expense created Successfully!",
    });
  } catch (error) {
    await t.rollback();
    res.status(500);
    throw new Error("Something went Wrong!");
  }
});

const getUserExpenses = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.rows) || 10;

  const offset = (page - 1) * perPage;
  const result = await Expense.findAndCountAll({
    where: {
      userId: req.user._id,
    },
    attributes: {
      exclude: ["userId"],
    },
    limit: perPage,
    offset: offset,
    order: [["createdAt", "DESC"]],
  });
  const { count, rows } = result;

  const totalPages = Math.ceil(count / perPage);
  res.status(200).json({
    expenses: rows,
    currentPage: page,
    totalPages: totalPages,
  });
});

const deleteUserExpense = asyncHandler(async (req, res, next) => {
  const _id = req.params.id;
  if (!_id) {
    res.status(400);
    throw new Error("Please provide an Id!");
  }
  try {
    const t = await sequelize.transaction(); //starting a transaction
    //find the expense to be deleted
    const expenseToDelete = await Expense.findOne({
      where: {
        userId: req.user._id,
        _id: _id,
      },
      transaction: t,
    });

    if (!expenseToDelete) {
      res.status(404);
      throw new Error("Expense not found");
    }
    //update user
    await User.decrement("totalExpenses", {
      by: expenseToDelete.amount,
      where: {
        _id: req.user._id,
      },
      transaction: t,
    });
    await expenseToDelete.destroy({ transaction: t });
    await t.commit(); //save changes
    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    await t.rollback(); //rollback the changes made since there's an error
    res.status(500);
    throw new Error("Something went Wrong!");
  }
});

module.exports = { addExpense, getUserExpenses, deleteUserExpense };
