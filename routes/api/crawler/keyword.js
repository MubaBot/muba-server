const express = require("express");
const router = express.Router();

const Keyword = require("@api/crawler/keyword");
const Works = require("@api/crawler/works");
const Auth = require("@controllers/auth");

router.get("/list/:page?", Auth.Admin.requireAdmin, Keyword.getList);
router.get("/worker/:keyword(*)", Auth.Admin.requireAdmin, Keyword.getWorkerByKeyword);

router.post("/", Auth.Admin.requireAdmin, Keyword.createKeyword);
router.put("/", Auth.Admin.requireAdmin, Works.reSearchKeyword);
router.delete("/", Auth.Admin.requireAdmin, Keyword.deleteKeyword);

module.exports = router;
