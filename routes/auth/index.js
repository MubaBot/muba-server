const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");

const ADMIN = require("./admin");
const OWNER = require("./owner");
const USER = require("./user");

router.get("/login", Auth.isLogin, Auth.checkLogin);
router.post("/login", Auth.doLogin, Auth.sendAuth);

router.get("/me", Auth.requireLogin, Auth.sendInformation);

router.use("/admin", ADMIN);
router.use("/owner", OWNER);
router.use("/user", USER);

module.exports = router;
