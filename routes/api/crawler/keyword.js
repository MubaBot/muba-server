const express = require("express");
const router = express.Router();

const Keyword = require("@controllers/api/crawler/keyword");
const Auth = require("@controllers/auth");

router.get("/list/:page?", Auth.requireAdmin, Keyword.getList);
router.post("/", Auth.requireAdmin, Keyword.createKeyword);

module.exports = router;
