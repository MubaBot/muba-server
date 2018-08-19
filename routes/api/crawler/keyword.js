const express = require("express");
const router = express.Router();

const Keyword = require("@api/crawler/keyword");
const Works = require("@api/crawler/works");
const Auth = require("@controllers/auth");

router.get("/list/:page?", Auth.requireAdmin, Keyword.getList);
router.post("/", Auth.requireAdmin, Keyword.createKeyword);
router.put("/", Auth.requireAdmin, Works.reSearchKeyword);

module.exports = router;
