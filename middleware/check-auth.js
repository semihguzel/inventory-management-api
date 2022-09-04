const jwt = require("jsonwebtoken");

const HttpError = require("../utils/HttpError");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) throw new HttpError("Authentication failed!", 401);

    const decodedToken = jwt.verify(token, process.env.JWT_SALT);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (err) {
    return next(new HttpError("Authentication failed!", 401));
  }
};
