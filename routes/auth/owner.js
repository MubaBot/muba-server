const express = require("express");
const router = express.Router();

// const Auth = require("@controllers/auth");
const Owner = require("@controllers/auth/owner");
const Admin = require("@controllers/auth/admin");

router.get("/:page([0-9]*)", Admin.requireAdmin, Owner.getOwnerMemberList);

// TODO: register #3
router.post("/", Owner.register);

router.put("/:id/allow", Admin.requireAdmin, Owner.allowOwner);
router.put("/:id/block", Admin.requireAdmin, Owner.blockOwner);

module.exports = router;
