const express = require("express");
const router = express.Router();

const Works = require("@api/crawler/works");
const Auth = require("@controllers/auth");

router.get("/list/:page?", Auth.requireAdmin, Works.getList);

router.delete("/:id([0-9]+)", Auth.requireAdmin, Works.deleteWorkingById);
router.delete("/all", Auth.requireAdmin, Works.deleteWorkingAll);

module.exports = router;
