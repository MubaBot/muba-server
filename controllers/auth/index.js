const passport = require('passport');

const jwt = require('./jwt');

exports.checkLogin = (req, res) => {
  return res.json({ isLogin: req.isLogin });
}

exports.doLogin = (req, res, next) => {
  req.body.ID = req.body.data.ID;
  req.body.PW = req.body.data.PW;

  return passport.authenticate('local')(req, res, next);
}

exports.sendAuth = (req, res) => {
  return res.json(req.user);
}

exports.isLogin = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    req.isLogin = false;
    return next();
  }

  const decode = jwt.verify(token);

  if (decode) req.isLogin = true;
  else req.isLogin = false;

  return next();
}