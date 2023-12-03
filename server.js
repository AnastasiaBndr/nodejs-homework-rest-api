const mongoose = require("mongoose");
const app = require("./app");

const { DB_HOST } = require("./config");
const PORT = 3000;
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running. Use our API on port: " + PORT);
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
