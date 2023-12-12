const { User } = require("../schema/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = {
  login,
  getCurrent,
};
