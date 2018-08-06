const express = require('express');
const router = express.Router();

const admin = require('../../controllers/auth/admin');

router.post('/', admin.register);

module.exports = router;
