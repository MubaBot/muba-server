const express = require("express");
const router = express.Router();

const Contents = require("@api/crawler/contents");
const Auth = require("@controllers/auth");

router.get("/list/:page", Auth.requireAdmin, Contents.getList);
router.get("/:id", Auth.requireAdmin, Contents.getContentById);

router.delete("/", Auth.requireAdmin, Contents.deleteContent);

module.exports = router;
