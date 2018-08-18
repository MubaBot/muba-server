const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");

const ADMIN = require("./admin");

router.get("/login", Auth.isLogin, Auth.checkLogin);
router.post("/login", Auth.doLogin, Auth.sendAuth);

router.get("/me", Auth.requireLogin, Auth.sendInformation);

router.use("/admin", ADMIN);

module.exports = router;
