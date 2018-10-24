const express = require("express");
const router = express.Router();
const UserOrderRouter = require("../order/user");

const Auth = require("@controllers/auth");
const User = require("@controllers/api/user");

router.get("/", Auth.requireLogin, User.getUserInfo);
router.put("/", Auth.requireLogin, User.setUserInfo);

router.get("/address", Auth.requireLogin, User.getAddress);
router.post("/address", Auth.requireLogin, User.setAddress);

router.get("/test", User.setAddress);

router.use("/order", UserOrderRouter);

module.exports = router;
