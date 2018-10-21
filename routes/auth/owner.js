const express = require("express");
const router = express.Router();

// const Auth = require("@controllers/auth");
const Owner = require("@controllers/auth/owner");

// TODO: register #3
router.post("/", Owner.register);

// router.get("/exist", Admin.existAdminUser);

// router.get("/me", Auth.Admin.requireAdmin, Auth.sendInformation);

module.exports = router;
