const express = require("express");
const router = express.Router();

const Auth = require("@controllers/auth");
const Admin = require("@controllers/auth/admin");

router.get("/:page(\\d+)", Admin.requireAdmin, Admin.getAdminList);
router.get("/exist", Admin.existAdminUser);
router.get("/me", Auth.Admin.requireAdmin, Auth.sendInformation);

// TODO: register #3
router.post("/", Admin.register);

router.put("/:id/allow", Auth.Admin.requireAdmin, Admin.allowAdmin);
router.put("/:id/block", Auth.Admin.requireAdmin, Admin.blockAdmin);

module.exports = router;
