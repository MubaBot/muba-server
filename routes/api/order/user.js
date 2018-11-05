const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");
const Order = require("@api/order");

router.get("/:page", Auth.requireUser, Order.getOrderListForUser);
router.delete("/:order", Auth.requireUser, Order.cancelOrder);

module.exports = router;
