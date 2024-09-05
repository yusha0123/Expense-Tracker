const Razorpay = require("razorpay");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { Parser } = require("json2csv");
const mongoose = require("mongoose");
const User = require("../models/user");
const Expense = require("../models/expense");
const Download = require("../models/download");
const uploadToCloudinary = require("../utils/upload");
const moment = require("moment");

const createOrder = asyncHandler(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET,
  });
  const options = {
    amount: 5000,
    currency: "INR",
  };
  instance.orders.create(options, (err, order) => {
    if (err) {
      res.status(500);
      throw new Error("Internal Server Error!");
    }
    return res.status(201).json(order);
  });
});

const verifyOrder = asyncHandler(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("All fields are Mandatory!");
  }

  const generatedSignature = crypto
    .createHmac("SHA256", process.env.RAZOR_PAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  const isValid = generatedSignature == razorpay_signature;
  if (!isValid) {
    res.status(400);
    throw new Error("Payment Failed!");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { isPremium: true },
      { session }
    );
    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "Payment Successful!",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500);
    throw new Error("Something went wrong!");
  } finally {
    session.endSession();
  }
});

const leaderboard = asyncHandler(async (req, res, next) => {
  try {

    const result = await User.aggregate([
      {
        $sort: { totalExpenses: -1 }
      },
      {
        $project: {
          _id: 0,
          name: 1,
          totalExpenses: 1,
          email: { $cond: { if: { $eq: ["$email", req.user.email] }, then: "$email", else: "$$REMOVE" } }
        }
      }
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong!");
  }
});

const getReport = asyncHandler(async (req, res, next) => {
  const type = req.query.type;
  const allowedTypes = ["monthly", "yearly", "weekly"];

  if (!allowedTypes.includes(type)) {
    res.status(400);
    throw new Error("Invalid Type Specified!");
  }

  let startDate = new Date();

  if (type === "weekly") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (type === "monthly") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const docsToSelect = { createdAt: 1, description: 1, category: 1, amount: 1 };

  try {
    const expenses = await Expense.find(
      {
        userId: req.user._id,
        createdAt: { $gte: startDate },
      },
      docsToSelect
    ).lean();

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong!");
  }
});

const downloadExpenses = asyncHandler(async (req, res, next) => {
  const { data } = req.body;
  if (!data || data?.length === 0) {
    res.status(400);
    throw new Error("Data doesn't satisfy the expected requirements!");
  }
  try {
    //Generate CSV file
    const array = [];
    data.forEach((element) => {
      const { createdAt, description, category, amount } = element;
      array.push({
        Date: moment(createdAt).format("MMMM DD, YYYY hh:mm:ss A"),
        Category: category,
        Description: description,
        Amount: amount,
      });
    });
    const fileName = `Expensify-${req.user._id}/${new Date()}.csv`;
    const csvFields = ["Date", "Category", "Description", " Amount"];
    const csvParser = new Parser(csvFields);
    const csv = csvParser.parse(array);
    const fileUrl = await uploadToCloudinary(csv, fileName);
    // //save to database
    await Download.create({
      url: fileUrl,
      userId: req.user,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Expensify.csv"`
    );
    res.setHeader("Content-Type", "text/csv");
    return res.status(200).send(csv);
  } catch (error) {
    res.status(500);
    throw new Error("Something went Wrong!");
  }
});

const getUserDownloads = asyncHandler(async (req, res, next) => {
  try {
    const result = await Download.find({ userId: req.user._id })
      .select("createdAt url")
      .sort({ createdAt: -1 });
    return res.status(200).json(result);
  } catch (error) {
    res.status(500);
    throw new Error("Something went wrong!");
  }
});

module.exports = {
  createOrder,
  verifyOrder,
  leaderboard,
  getReport,
  downloadExpenses,
  getUserDownloads,
};
