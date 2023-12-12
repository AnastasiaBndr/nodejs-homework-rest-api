const { User } = require("../schema/user");
const { HttpError } = require("../helpers");

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

module.exports = {
  logOut,
};
