const express = require('express');
const router = express.Router();

const CRAWLER = require("./crawler");

router.use("/crawler", CRAWLER);

module.exports = router;
