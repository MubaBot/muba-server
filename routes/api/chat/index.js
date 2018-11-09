const express = require("express");
const router = express.Router();

const Chat = require("@api/chat");
const Auth = require("@controllers/auth");

router.post("/", Auth.requireLogin, Chat.doChat);

module.exports = router;
