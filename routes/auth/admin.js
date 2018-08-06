const express = require('express');
const router = express.Router();
const passport = require('passport');

const checkLogin = passport.authenticate('local');

const admin = require('../../controllers/auth/admin');

router.post('/', admin.register);

router.get('/login', checkLogin);

router.get('/check', admin.existAdminUser);

module.exports = router;
