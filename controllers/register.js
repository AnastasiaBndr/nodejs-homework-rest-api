const { User } = require("../schema/user");
const bcrypt = require("bcrypt");
const { HttpError } = require("../helpers");

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

module.exports = {
  register,
};
