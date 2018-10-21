const passport = require("passport");

const jwt = require("./jwt");

exports.Owner = { ...require("./owner") };
exports.Admin = { ...require("./admin") };

/**
 * Router
 */
exports.checkLogin = (req, res) => {
  return res.json({ isLogin: req.isLogin, id: req.id, token: req.token });
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
exports.requireLogin = (req, res, next) => {
  const decode = jwt.getDecodeData(req);
  if (decode) req.info = decode;
  else return res.status(401).send("Unauthorized");

  return next();
};

exports.doLogin = (req, res, next) => {
  return passport.authenticate("local")(req, res, next);
};

exports.isLogin = async (req, res, next) => {
  const decode = jwt.getDecodeData(req);

  if (decode === "TokenExpiredError") {
    req.isLogin = true;
    req.id = jwt.refreshToken(req)._id;
  } else if (decode) {
    req.isLogin = true;
    req.id = decode._id;
  } else req.isLogin = false;

  return next();
};

exports.getLoginInfo = (req, res, next) => {
  const decode = jwt.getDecodeData(req);
  if (decode) req.info = decode;

  return next();
};

exports.requireUser = async (req, res, next) => {
  const decode = jwt.getDecodeData(req);

  if (decode && decode.type === "USER") {
    req.info = decode;
  } else return res.status(401).send("Unauthorized");

  return next();
};
