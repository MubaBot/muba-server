const express = require("express");
const router = express.Router();

const API = require("./api");
const AUTH = require("./auth");
const STATIC = require("./static");

router.use("/api", API);
router.use("/auth", AUTH);
router.use("/static", STATIC);

module.exports = router;
