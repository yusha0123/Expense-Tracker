const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Expense = require("../models/expense");
const User = require("../models/user");

const addExpense = asyncHandler(async (req, res, next) => {
  const { amount, category, description } = req.body;
  if (!amount || !category || !description) {
    res.status(400);
    throw new Error("All fields are Mandatory!");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Expense.create(
      [
        {
          amount,
          category,
          description,
          userId: req.user,
        },
      ],
      {
        session,
      }
    );

    const totalExpenses = Number(req.user.totalExpenses) + Number(amount);

    await User.updateOne(
      { _id: req.user },
      {
        totalExpenses,
      }
    ).session(session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      messsage: "Expense created Successfully!",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500);
    throw new Error("Something went Wrong!");
  } finally {
    session.endSession();
  }
});

const getUserExpenses = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.rows) || 10;

  const skip = (page - 1) * perPage;

  try {
    const count = await Expense.countDocuments({ userId: req.user._id });
    const expenses = await Expense.find({ userId: req.user._id })
      .select({ userId: 0 })
      .limit(perPage)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(count / perPage);

    res.status(200).json({
      expenses,
      currentPage: page,
      totalPages,
      totalItems: count,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Something went Wrong!");
  }
});

const deleteUserExpense = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    res.status(400);
    throw new Error("Please provide an Id!");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const expenseToDelete = await Expense.findOne({
      userId: req.user._id,
      _id: id,
    }).session(session);

    if (!expenseToDelete) {
      res.status(404);
      throw new Error("Expense not found");
    }
    // Update the user's totalExpenses
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $inc: { totalExpenses: -expenseToDelete.amount } },
      { session }
    );

    await expenseToDelete.deleteOne({ session }); // Delete the expense
    await session.commitTransaction();

    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500);
    throw new Error("Something went Wrong!");
  } finally {
    session.endSession();
  }
});

module.exports = { addExpense, getUserExpenses, deleteUserExpense };
