const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");
const User = require("@controllers/api/user");

router.get("/address", Auth.requireLogin, User.getAddress);
router.post("/address", Auth.requireLogin, User.setAddress);

router.get("/test", User.setAddress);

module.exports = router;
