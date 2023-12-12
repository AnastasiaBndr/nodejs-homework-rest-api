const express = require("express");
const { schemas } = require("../../schema/user");
const users = require("../../controllers/register");

const router = express.Router();
const { HttpError } = require("../../helpers");

router.post("/", async (req, res, next) => {
  try {
    const { error } = schemas.registerSchema.validate(req.body);
    if (error) {
      HttpError(res, 400, error.message);
    } else {
      const result = await users.register(req, res);
      if (result !== null) res.status(201).json(result);
      else HttpError(res, 409, "Email is used!");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
