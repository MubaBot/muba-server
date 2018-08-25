const express = require("express");
const router = express.Router();

const Shops = require("@api/crawler/shops");
const Auth = require("@controllers/auth");

router.get("/list/:page?", Auth.requireAdmin, Shops.getList);

router.delete("/:id", Auth.requireAdmin, Shops.deleteShopById);

module.exports = router;
