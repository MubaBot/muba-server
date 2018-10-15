const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");
const Order = require("@api/order");

router.get("/user/:page", Auth.requireUser, Order.getOrderListForUser);
router.get("/owner/:page", Auth.requireOwner, Order.getOrderListForOwner);
router.get("/owner/admission/:page", Auth.requireOwner, Order.getOrderListForOwnerByAdmission);

router.put("/owner/:id/allow", Auth.requireOwner, Order.allowOrder);
router.put("/owner/:id/refuse", Auth.requireOwner, Order.refuseOrder);

module.exports = router;
