const express = require("express");
const router = express.Router();

const CRAWLER = require("./crawler");
const USER = require("./user");
const MAP = require("./map");
const SHOP = require("./shop");
const BUSINESS = require("./business");
const ORDER = require("./order");

router.use("/crawler", CRAWLER);
router.use("/user", USER);
router.use("/map", MAP);
router.use("/shop", SHOP);
router.use("/business", BUSINESS);
router.use("/order", ORDER);

module.exports = router;
