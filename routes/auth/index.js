const express = require('express');
const router = express.Router();

const ADMIN = require('./admin');

router.use('/admin', ADMIN);

module.exports = router;
