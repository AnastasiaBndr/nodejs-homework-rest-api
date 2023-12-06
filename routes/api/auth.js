const express = require("express");
const { schemas } = require("../../schema/user");
const users = require("../../controllers/auth");

const router = express.Router();
const { HttpError } = require("../../helpers");

router.post("/register", async (req, res, next) => {
  try {
    const { error } = schemas.registerSchema.validate(req.body);
    if (error) {
      HttpError(res, 400, error.message);
    } else {
      const result = await users.register(req.body);
      if (result !== null) res.status(201).json(result);
      else HttpError(res, 409, "Email is used!");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = schemas.authSchema.validate(req.body);
    if (error) {
      HttpError(res, 400, error.message);
    } else {
      const result = await users.login(req.body);
      if (result !== null) res.status(201).json(result);
      else HttpError(res, 401, "Email or password invalid!");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
