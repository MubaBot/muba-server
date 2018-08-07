const express = require('express');
const router = express.Router();

const Admin = require('../../controllers/auth/admin');

router.post('/', Admin.register);

router.get('/check', Admin.existAdminUser);

module.exports = router;
