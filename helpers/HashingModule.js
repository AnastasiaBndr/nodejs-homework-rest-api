const bcrypt = require("bcryptjs");

const createHashPassword = async (password) => {
  const result = await bcrypt.hashSync("12321", 10);
  return result;
};

module.exports = { createHashPassword };
