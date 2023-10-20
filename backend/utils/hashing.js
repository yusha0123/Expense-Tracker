const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const isCorrectPass = async (hashedPassword, password) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = { encryptPassword, isCorrectPass };
