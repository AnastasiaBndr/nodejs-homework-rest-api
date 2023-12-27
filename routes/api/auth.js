const express = require("express");
const { schemas } = require("../../schema/user");
const users = require("../../controllers/auth");
const { authentificate, upload } = require("../../middlewares");

const router = express.Router();
const { HttpError } = require("../../helpers");

router.post("/login", async (req, res, next) => {
  try {
    const { error } = schemas.authSchema.validate(req.body);
    console.log(req.body)
    if (error) {
      HttpError(res, 400, error.message);
    }
    else{
      const result = await users.login(req.body, res);
      if (result !== null) res.status(201).json(result);
      else HttpError(res, 401, "Email or password invalid!");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/verify", async(req, res, next)=>{
  try {
    const { error } = schemas.emailSchema.validate(req.body);
    if (error) {
      HttpError(res, 400, error.message);
    } else {
      users.resendVerifyEmail(req.body, res);
    }
  } catch (err) {
    next(err);
  }
  
})

router.get("/verify/:verificationToken", async (req, res, next) => {
  users.verifyEmail(req.params,res);
});

router.get("/current", authentificate, async (req, res, next) => {
  users.getCurrent(req, res);
});

router.post("/logout", authentificate, async (res, req, next) => {
  users.logOut(res, req);
});

router.post("/register", async (req, res, next) => {
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

router.patch(
  "/avatars",
  authentificate,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const avatarURL = await users.updateAvatars(req.user, req.file);
      res.json({ avatarURL });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

module.exports = router;
