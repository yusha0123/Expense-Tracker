const validator = require("validator");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const ResetPassword = require("../models/resetPassword");
let emailTemplate = require("../views/emailTemplate");

const createUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are Mandatory!",
      });
    }
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists!",
      });
    }
    //check if email or password is correct
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please use a Valid Email!",
      });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password is too weak!",
      });
    }
    //Signup the user

    const result = await User.create({
      name,
      email,
      password,
    });

    const token = result.generateAuthToken();

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully!",
      token,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error!");
  }
});

const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are Mandatory!",
      });
    }
    //check if user exists
    const result = await User.findOne({ email });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exists!",
      });
    }
    //check if provided password is correct
    const isValidUser = await result.comparePassword(password);
    if (!isValidUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }
    //login the user
    const token = result.generateAuthToken();
    return res.status(200).json({
      success: true,
      message: "User Logged in Successfully!",
      token,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error!");
  }
});

const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const { isPremium, email } = req.user;

    const updatedToken = jwt.sign(
      {
        email,
        isPremium,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token: updatedToken
    })

  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error!");
  }
})

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
    await ResetPassword.deleteMany(
      {
        userId: user._id,
      },
      session
    ); //delete all previous sessions/request of reset password

    const token = uuidv4();
    const url = `${process.env.FRONT_END_URL}`;
    emailTemplate = emailTemplate.replace("{UUID_PLACEHOLDER}", token);
    emailTemplate = emailTemplate.replace("{SERVER_ADDRESS_PLACEHOLDER}", url);

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
    return res.status(404).send("Invalid or expired link!");
  }

  const expiresInDate = new Date(result.expiresIn);
  const currentDate = new Date();
  if (expiresInDate < currentDate) {
    await ResetPassword.deleteOne({ token }); //delete the expired token
    return res.status(400).send("Link expired, Please request a new One!");
  }

  res.send("Token validated successfully!");
});

const changePassword = asyncHandler(async (req, res, next) => {
  const token = req.params.token;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Password is required!");
  }
  const result = await ResetPassword.findOne({ token });

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
    await ResetPassword.deleteOne({ token }); //delete the expired token
    res.status(400);
    throw new Error("Session Expired!");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

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
});

module.exports = {
  createUser,
  login,
  resetPassword,
  validateToken,
  changePassword,
  refreshToken
};
