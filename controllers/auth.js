const { User } = require("../schema/user");
const bcrypt = require("bcrypt");

const register = async (body) => {
  try {
    const hashPassword = await bcrypt.hash(body.password, 10);
    const newUser = await User.create({ ...body, password: hashPassword });
    return newUser;
  } catch (err) {
    return null;
  }
};

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
    } else return user;
  } catch (err) {
    return null;
  }
};

module.exports = {
  register,
  login,
};
