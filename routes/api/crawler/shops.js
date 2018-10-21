const express = require("express");
const router = express.Router();

const Shops = require("@api/crawler/shops");
const Auth = require("@controllers/auth");

router.get("/list/:page?", Auth.Admin.requireAdmin, Shops.getList);

router.put("/move", Auth.Admin.requireAdmin, Shops.moveShops);

router.delete("/:id", Auth.Admin.requireAdmin, Shops.deleteShopById);

module.exports = router;
