// @collapse
const jwt = require("jsonwebtoken");
const account = require("../models/accountSchema");

// *check user is genuine or fake user

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token && token != "undefined") {
      const verifyUser = await jwt.verify(token, process.env.SECRET_KEY);
      const user = await account.findOne({ _id: verifyUser._id });
      req.user = user;
      req.token = token;
    } else {
      req.user = null; // *indicates user/newuser is not log in or may be log out
    }
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).send(err);
  }
};

module.exports = authentication;
