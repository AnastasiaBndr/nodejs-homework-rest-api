const { HttpError } = require("../helpers/");
const jwt = require("jsonwebtoken");

const { User } = require("../schema/user");

const { SECRET_KEY } = process.env;

const authentificate = async (req, res, next) => {
  const { authorization = "" } = req.headers;

  const tbh = authorization.split(" ");
  const bearer = tbh[0];
  const token = tbh[1];

  if (bearer !== "Bearer") {
    next(HttpError(res, "401", "Not authorized!"));
  }
  try {
    const { id = "" } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || user.token !== token || !user.token) {
      next(HttpError(res, "404", "Not authorized!"));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(res, "401", "Not authorized!"));
  }
};

module.exports = { authentificate };
