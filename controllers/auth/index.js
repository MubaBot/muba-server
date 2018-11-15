const passport = require("passport");

const User = require("@models").user;
const Admin = require("@models").admin;
const Owner = require("@models").owner;

const jwt = require("./jwt");

exports.Owner = { ...require("./owner") };
exports.Admin = { ...require("./admin") };

/**
 * Router
 */
exports.checkLogin = async (req, res) => {
  const type = req.type;
  const id = req.id;

  switch (type) {
    case "USER":
      const user = await User.findOne({ where: { _id: id, BLOCK: false } });
      if (user) return res.json({ isLogin: req.isLogin, id: id, token: req.token, name: user.USERNAME });
      break;
    case "ADMIN":
      const admin = await Admin.findOne({ where: { _id: id, BLOCK: false } });
      if (admin) return res.json({ isLogin: req.isLogin, id: id, token: req.token, name: admin.USERNAME });
      break;
    case "OWNER":
      const owner = await Owner.findOne({ where: { _id: id, BLOCK: false } });
      if (owner) return res.json({ isLogin: req.isLogin, id: id, token: req.token, name: owner.USERNAME });
      break;
  }

  return res.json({ isLogin: false });
};

exports.sendAuth = (req, res) => {
  return res.json(req.user);
};

exports.sendInformation = async (req, res) => {
  const type = req.info.type;
  const id = req.info._id;

  switch (type) {
    case "USER":
      const user = await User.findOne({ where: { _id: id, BLOCK: false } });
      if (user) return res.json(user);
      break;
    case "ADMIN":
      const admin = await Admin.findOne({ where: { _id: id, BLOCK: false } });
      if (admin) return res.json(admin);
      break;
    case "OWNER":
      const owner = await Owner.findOne({ where: { _id: id, BLOCK: false } });
      if (owner) return res.json(owner);
      break;
  }

  return res.status(401).send("Unauthorized");
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
    const refreshData = jwt.refreshToken(req);
    req.type = refreshData.type;
    req.id = refreshData._id;
    req.name = refreshData.username;
  } else if (decode) {
    req.isLogin = true;
    req.type = decode.type;
    req.id = decode._id;
    req.name = decode.username;
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
