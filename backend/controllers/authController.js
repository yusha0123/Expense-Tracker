const validator = require("validator");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/user");
const ResetPassword = require("../models/resetPassword");
const { encryptPassword, isCorrectPass } = require("../utils/hashing");
const createToken = require("../utils/tokenGenerator");
let emailTemplate = require("../views/emailTemplate");

const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are Mandatory!");
  }
  //check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User Already Exists!");
  }
  //check if email or password is correct
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please use a Valid Email!");
  }
  if (!validator.isStrongPassword(password)) {
    res.status(400);
    throw new Error("Password is not Strong Enough!");
  }
  //Signup the user
  const hashedPassword = await encryptPassword(password);
  const result = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = createToken(result._id);
  res.status(201).json({
    success: true,
    message: "User Registered Successfully!",
    token,
    email,
    isPremium: false,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are Mandatory!");
  }
  //check if user exists
  const result = await User.findOne({ email });
  if (!result) {
    res.status(404);
    throw new Error("User doesn't Exists!");
  }
  //check if provided password is correct
  const isValidUser = await isCorrectPass(result.password, password);
  if (!isValidUser) {
    res.status(401);
    throw new Error("Invalid Credentials!");
  }
  //login the user
  const token = createToken(result._id);
  res.status(200).json({
    success: true,
    message: "User Logged in Successfully!",
    token,
    email,
    isPremium: result.isPremium,
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email!");
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const token = uuidv4();
    const serverAddress = process.env.SERVER_ADDRESS;
    emailTemplate = emailTemplate.replace("{UUID_PLACEHOLDER}", token); // Adding a dynamic token
    emailTemplate = emailTemplate.replace(
      "{SERVER_ADDRESS_PLACEHOLDER}",
      serverAddress
    ); // Adding a dynamic server address

    await ResetPassword.create(
      [
        {
          token,
          userId: user._id,
        },
      ],
      { session }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // Send the password reset email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password for Expensify Account",
      html: emailTemplate,
    });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500);
    throw new Error("Internal Server Error!");
  } finally {
    session.endSession();
  }
});

const validateToken = asyncHandler(async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    res.status(400);
    throw new Error("Invalid Link!");
  }

  const result = await ResetPassword.findOne({ token });
  if (!result) {
    return res.status(404).send("Please request a new Link!");
  }
  res.sendFile(path.join(__dirname, "../", "views", "resetPass.html"));
});

const changePassword = async (req, res, next) => {
  const token = req.params.token;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Please enter a new password!");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await ResetPassword.findOne({ token }).session(session);

    if (!result) {
      res.status(400);
      throw new Error("Invalid Session!");
    }

    if (!validator.isStrongPassword(password)) {
      res.status(400);
      throw new Error("Password is not strong enough!");
    }

    const expiresInDate = new Date(result.expiresIn);
    const currentDate = new Date();
    if (expiresInDate < currentDate) {
      res.status(400);
      throw new Error("Session Expired!");
    }

    // hash the password before saving to the database
    const hashedPassword = await encryptPassword(password);

    // Update the user's password
    await User.updateOne(
      { _id: result.userId },
      { password: hashedPassword }
    ).session(session);

    // Delete the token from the database to ensure that each link works only once
    await ResetPassword.deleteOne({ token }).session(session);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500);
    throw new Error("Internal Server Error!");
  } finally {
    session.endSession();
  }
};

module.exports = {
  createUser,
  login,
  resetPassword,
  validateToken,
  changePassword,
};
