const { User } = require("../schema/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { HttpError } = require("../helpers");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const { SECRET_KEY } = process.env;

const login = async (body) => {
  try {
    const user = await User.findOne({
      email: body.email,
    });

    const passwordCompare = await bcrypt.compare(body.password, user.password);
    console.log(user + "       " + passwordCompare);
    if (!passwordCompare) {
      return null;
    } else if (!user) {
      return null;
    } else {
      const payload = { id: user.id };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

      await User.findByIdAndUpdate(
        user._id,
        { token },
        {
          new: true,
        }
      );

      return {
        token: token,
        email: user.email,
        subscription: user.subscription,
      };
    }
  } catch (err) {
    return null;
  }
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  return res.json({ email: email, subscription: subscription });
};

const logOut = async (req, res) => {
  const { user } = req;
  console.log(user);
  await User.findByIdAndUpdate(
    user._id,
    { token: "" },
    {
      new: true,
    }
  );
  return HttpError(res, 204, "No Content");
};

const register = async (req, res) => {
  const { body } = req;
  const hashPassword = await bcrypt.hash(body.password, 10);
  const avatarUrl = gravatar.url(body.email);
  const tempUser = await User.findOne({ email: body.email });
  if (!tempUser) {
    const newUser = await User.create({
      ...body,
      password: hashPassword,
      avatarURL: avatarUrl,
    });
    if (newUser) {
      await newUser.validate();
      const data = await newUser.save();
      return data;
    } else return null;
  } else return HttpError(res, 409, "Email is used");
};

const updateAvatars = async (user, file) => {
  const { _id } = user;
  const { path: tempUpload, originalname } = file;
  const avatarName = user.email.split("@")[0] + ".png";
  Jimp.read(originalname)
    .then((lenna) => {
      return lenna
        .resize(250, 250) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(avatarName); // save
    })
    .catch((err) => {
      console.error(err);
    });

  const resultUpload = path.join(avatarsDir, avatarName);

  await fs.promises.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", avatarName);

  await User.findByIdAndUpdate(_id, { avatarURL });

  return avatarURL;
};

module.exports = {
  login,
  getCurrent,
  logOut,
  register,
  updateAvatars,
};
