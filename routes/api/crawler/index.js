const express = require("express");
const router = express.Router();

const KEYWORD = require("./keyword");
const WORKING = require("./working");

router.use("/keyword", KEYWORD);
router.use("/working", WORKING);

module.exports = router;
