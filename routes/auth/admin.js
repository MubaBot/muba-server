const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");
const Admin = require("@controllers/auth/admin");

// TODO: register #3
router.post("/", Admin.register);

router.get("/exist", Admin.existAdminUser);

router.get("/me", Auth.requireAdmin, Auth.sendInformation);

module.exports = router;
