const express = require("express");
const router = express.Router();

// const Auth = require("@controllers/auth");
const User = require("@controllers/auth/user");
const Admin = require("@controllers/auth/admin");

router.get("/:page(\\d+)", Admin.requireAdmin, User.getUserMemberList);
// TODO: register #3
router.post("/", User.register);

router.put("/:id/allow", Admin.requireAdmin, User.allowUser);
router.put("/:id/block", Admin.requireAdmin, User.blockUser);

module.exports = router;
