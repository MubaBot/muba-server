const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");
const Order = require("@api/order");

router.get("/:page", Auth.requireUser, Order.getOrderListForUser);

module.exports = router;
