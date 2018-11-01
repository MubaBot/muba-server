const express = require("express");
const path = require("path");
const router = express.Router();

const Auth = require("@controllers/auth");

router.use("/business", express.static(path.join(process.env.PWD, "uploads/business")));
router.use("/public", express.static(path.join(process.env.PWD, "public")));

module.exports = router;
