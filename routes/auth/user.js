const express = require("express");
const router = express.Router();

// const Auth = require("@controllers/auth");
const User = require("@controllers/auth/user");

// TODO: register #3
router.post("/", User.register);

// router.get("/exist", Admin.existAdminUser);

// router.get("/me", Auth.requireAdmin, Auth.sendInformation);

module.exports = router;
