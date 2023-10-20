const asyncHandler = require("express-async-handler");

const verifyPremium = asyncHandler((req, res, next) => {
  if (!req.user.isPremium) {
    res.status(401);
    throw new Error("Please upgrade to Pro to access this feature!");
  }
  next();
});

module.exports = verifyPremium;
