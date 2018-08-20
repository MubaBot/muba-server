const express = require("express");
const router = express.Router();

const Works = require("@api/crawler/works");
const Auth = require("@controllers/auth");

router.get("/list/:page?", Auth.requireAdmin, Works.getList);

module.exports = router;
