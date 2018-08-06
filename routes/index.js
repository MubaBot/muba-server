const express = require('express');
const router = express.Router();

const API = require('./api');
const AUTH = require('./auth');

router.use('/api', API);
router.use('/auth', AUTH);

module.exports = router;
