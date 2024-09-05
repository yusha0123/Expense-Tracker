const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
  }
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      isPremium: this.isPremium,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

UserSchema.methods;

const User = mongoose.model("User", UserSchema);

module.exports = User;
