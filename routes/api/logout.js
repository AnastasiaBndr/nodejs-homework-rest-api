const express = require("express");
const users = require("../../controllers/logout");
const { authentificate } = require("../../middlewares");

const router = express.Router();

router.post("/", authentificate, async (res, req, next) => {
  users.logOut(res, req);
});

module.exports = router;
