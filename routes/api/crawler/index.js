const express = require("express");
const router = express.Router();

const KEYWORD = require("./keyword");
const WORKING = require("./working");
const CONTENTS = require("./contents");

router.use("/keyword", KEYWORD);
router.use("/working", WORKING);
router.use("/contents", CONTENTS);

module.exports = router;
