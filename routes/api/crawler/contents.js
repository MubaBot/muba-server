const express = require("express");
const router = express.Router();

const Contents = require("@api/crawler/contents");
const Auth = require("@controllers/auth");

router.get("/list/:page", Auth.Admin.requireAdmin, Contents.getList);
router.get("/:id", Auth.Admin.requireAdmin, Contents.getContentById);

router.delete("/", Auth.Admin.requireAdmin, Contents.deleteContent);

module.exports = router;
