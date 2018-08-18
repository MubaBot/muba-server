const express = require("express");
const router = express.Router();

const KEYWORD = require("./keyword");

router.use("/keyword", KEYWORD);

module.exports = router;
