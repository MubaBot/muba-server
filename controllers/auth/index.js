const passport = require("passport");

const jwt = require("./jwt");

/**
 * Router
 */
exports.checkLogin = (req, res) => {
  return res.json({ isLogin: req.isLogin });
};

exports.sendAuth = (req, res) => {
  return res.json(req.user);
};

exports.sendInformation = (req, res) => {
  return res.json(req.info);
};

/**
 * Methods
 */
const getDecodeData = req => {
  req.token = req.headers["x-access-token"];

  if (!req.token) {
    req.isLogin = false;
    return null;
  }

  return jwt.verify(req.token);
};

exports.requireLogin = (req, res) => {
  const decode = getDecodeData(req);
  if (decode) req.info = decode;
  else return res.status(401).send("Unauthorized");

  return next();
};

exports.doLogin = (req, res, next) => {
  return passport.authenticate("local")(req, res, next);
};

exports.isLogin = async (req, res, next) => {
  const decode = getDecodeData(req);

  if (decode) req.isLogin = true;
  else req.isLogin = false;

  return next();
};

exports.requireAdmin = async (req, res, next) => {
  const decode = getDecodeData(req);

  if (decode && decode.type === "ADMIN") {
    req.info = decode;
    req.isAdmin = true;
  } else return res.status(401).send("Unauthorized");

  return next();
};
