const { User } = require("../schema/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");

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
  const tempUser = await User.findOne({ email: body.email });
  if (!tempUser) {
    const newUser = await User.create({ ...body, password: hashPassword });
    if (newUser) {
      await newUser.validate();
      const data = await newUser.save();
      return data;
    } else return null;
  } else return HttpError(res, 409, "Email is used");
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  return res.json({ email: email, subscription: subscription });
};

module.exports = {
  login,
  getCurrent,
  logOut,
  register
};
