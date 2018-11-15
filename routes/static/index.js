const express = require("express");
const path = require("path");
const router = express.Router();

const Auth = require("@controllers/auth");

router.use("/business/:token", Auth.Admin.isAdminByToken, express.static(path.join(process.env.PWD, "uploads/business")));
router.use("/menu", express.static(path.join(process.env.PWD, "uploads/menu")));
router.use("/review", express.static(path.join(process.env.PWD, "uploads/review")));
router.use("/public", express.static(path.join(process.env.PWD, "public")));

module.exports = router;
