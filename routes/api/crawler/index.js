const express = require("express");
const router = express.Router();

const KEYWORD = require("./keyword");
const WORKING = require("./working");
const CONTENTS = require("./contents");
const SHOPS = require("./shops");

router.use("/keyword", KEYWORD);
router.use("/working", WORKING);
router.use("/contents", CONTENTS);
router.use("/shops", SHOPS);

module.exports = router;
