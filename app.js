const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const registerRouter = require("./routes/api/register");
const loginRouter = require("./routes/api/auth");
const logoutRouter = require("./routes/api/logout");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/users/register", registerRouter);
app.use("/users/login", loginRouter);
app.use("/users/logout", logoutRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Problem" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
