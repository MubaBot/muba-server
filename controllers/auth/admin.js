const Op = require("sequelize").Op;
const sha512 = require("js-sha512");

const jwt = require("./jwt");

const Admin = require("@models").admin;

const ShowCount = 10;

/*
 *=========
 * Routers
 *=========
 */

/**
 * success
 *    0 : Create success
 *   -1 : ID empty
 *   -2 : Username empty
 *   -3 : Email empty
 *   -4 : Password empty
 *   -5 : Mismatched passwords
 *   -6 : Exist user
 *   -7 : Database error
 */
exports.register = async (req, res, next) => {
  if (!req.body.id) return res.status(412).json({ success: -1 });
  if (!req.body.username) return res.status(412).json({ success: -2 });
  if (!req.body.email) return res.status(412).json({ success: -3 });
  if (!req.body.password || !req.body.repassword) return res.status(412).json({ success: -4 });

  if (req.body.password != req.body.repassword) return res.status(412).json({ success: -5 });

  const exist = await Admin.findAll({
    where: {
      [Op.or]: [{ id: req.body.id }, { email: req.body.email }]
    }
  }).catch(e => res.status(500).send({ success: -7 }));

  if (exist.length != 0) return res.status(409).json({ success: -6 });

  return await Admin.create({
    ID: req.body.id,
    USERNAME: req.body.username,
    EMAIL: req.body.email,
    PASSWORD: sha512(req.body.password)
  })
    .then(r => res.send({ success: 0 }))
    .catch(e => res.status(500).send({ success: -7 }));
};

/**
 * exist
 *    true : At least one user exists.
 *   false : User does not exist.
 */
exports.existAdminUser = async (req, res, next) => {
  const exist = await Admin.findAll({});

  if (exist.length != 0) return res.json({ exist: true });
  return res.json({ exist: false });
};

exports.getAdminList = async (req, res, next) => {
  const page = req.params.page;
  const id = req.info._id;

  const admin = await Admin.findAll({
    offset: (page - 1) * ShowCount,
    limit: ShowCount
  });

  const count = await Admin.count({});

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: admin });
};

exports.requireAdmin = async (req, res, next) => {
  const decode = jwt.getDecodeData(req);

  if (decode && decode.type === "ADMIN") {
    req.info = decode;
    req.isAdmin = true;
  } else return res.status(401).send("Unauthorized");

  return next();
};

exports.requireAdminForRegister = async (req, res, next) => {
  const exist = await Admin.count({});
  if (exist === 0) return next();

  const decode = jwt.getDecodeData(req);

  if (decode && decode.type === "ADMIN") {
    req.info = decode;
    req.isAdmin = true;
  } else return res.status(401).send("Unauthorized");

  return next();
};

exports.allowAdmin = async (req, res, next) => {
  const id = req.params.id;

  return Admin.update({ BLOCK: false }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.blockAdmin = async (req, res, next) => {
  const id = req.params.id;

  return Admin.update({ BLOCK: true }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.isAdminByToken = async (req, res, next) => {
  req.headers["x-access-token"] = req.params.token;
  const decode = jwt.getDecodeData(req);

  if (decode && decode.type === "ADMIN") {
    req.info = decode;
    req.isAdmin = true;
  } else return res.status(401).send("Unauthorized");

  return next();
};

/*
 *=========
 * Methods
 *=========
 */
exports.checkId = async id => {
  const exist = await Admin.findOne({ where: { ID: id, BLOCK: false } });
  return exist ? true : false;
};

exports.checkEmail = async email => {
  const exist = await Admin.findOne({ where: { EMAIL: email, BLOCK: false } });
  return exist ? true : false;
};

exports.existUser = async (name, idMode = "ID") => {
  if (idMode === "ID") return exports.checkId(name);
  return exports.checkEmail(name);
};

exports.getUser = async (mode, id) => {
  const admin = await Admin.findOne({
    where: { [mode]: id }
  });

  return {
    type: "ADMIN",
    _id: admin._id,
    id: admin.ID,
    username: admin.USERNAME,
    email: admin.EMAIL
  };
};

exports.comparePassword = async (mode, id, password, callback) => {
  const admin = await Admin.findOne({
    where: { [mode]: id }
  });

  if (admin.PASSWORD === sha512(password)) return true;
  else return false;
};
