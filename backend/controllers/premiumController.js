const Razorpay = require("razorpay");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/user");
const { Op } = require("sequelize");
const sequelize = require("../utils/database");
const { Parser } = require("json2csv");
const uploadToS3 = require("../utils/upload");

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
    return res.json({ success: true, message: "Order Created", data: order });
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
  if (isValid) {
    const updatedRows = await User.update(
      { isPremium: true },
      { where: { _id: req.user._id } }
    );
    if (updatedRows[0] === 1) {
      res.status(200).json({
        success: true,
        message: "Payment Successful!",
      });
    } else {
      res.status(400);
      throw new Error("User not found or update failed.");
    }
  } else {
    res.status(400);
    throw new Error("Payment Failed");
  }
});

const leaderboard = asyncHandler(async (req, res, next) => {
  const result = await User.findAll({
    attributes: ["name", "totalExpenses"],
    order: [["totalExpenses", "DESC"]],
  });
  res.status(200).json(result);
});

const getReport = asyncHandler(async (req, res, next) => {
  const type = req.query.type;
  if (type != "monthly" && type != "yearly") {
    res.status(400);
    throw new Error("Invalid Type Specified!");
  }
  if (type == "monthly") {
    const currentDate = new Date();
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(currentDate.getMonth() - 1);
    const monthlyExpenses = await req.user.getExpenses({
      attributes: ["createdAt", "description", "category", "amount"],
      where: {
        createdAt: {
          [Op.gte]: lastMonth,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(monthlyExpenses);
  } else {
    const currentDate = new Date();
    const lastYear = new Date(currentDate);
    lastYear.setFullYear(currentDate.getFullYear() - 1);
    const yearlyExpenses = await req.user.getExpenses({
      attributes: ["createdAt", "description", "category", "amount"],
      where: {
        createdAt: {
          [Op.gte]: lastYear,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(yearlyExpenses);
  }
});

const downloadExpenses = asyncHandler(async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const result = await req.user.getExpenses({
      attributes: ["createdAt", "description", "category", "amount"],
    });
    if (result.length == 0) {
      return res.status(200).json({
        url: "",
        success: false,
      });
    }
    //Generate CSV file
    const data = [];
    result.forEach((element) => {
      const { createdAt, description, category, amount } = element;
      data.push({ createdAt, category, description, amount });
    });
    const fileName = `Expensify-${req.user._id}/${new Date()}.csv`;
    const csvFields = ["createdAt", "category", "description", " amount"];
    const csvParser = new Parser(csvFields);
    const csv = csvParser.parse(data);
    const fileUrl = await uploadToS3(csv, fileName);
    //save to database
    await req.user.createDownload(
      {
        url: fileUrl,
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    return res.status(200).json({
      url: fileUrl,
      success: true,
    });
  } catch (error) {
    await t.rollback();
    res.status(500);
    throw new Error("Something went Wrong!", error.message);
  }
});

const getUserDownloads = asyncHandler(async (req, res, next) => {
  const result = await req.user.getDownloads({
    attributes: ["createdAt", "url", "_id"],
  });
  res.status(200).json(result);
});

module.exports = {
  createOrder,
  verifyOrder,
  leaderboard,
  getReport,
  downloadExpenses,
  getUserDownloads,
};
