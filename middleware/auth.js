const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //generated token
  const token = req.header("x-auth-token");
  //if no token
  if (!token) return res.status(401).send("Access denied no token provided");
  try {
    //verify the token provided
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}