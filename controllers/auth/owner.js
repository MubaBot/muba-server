const Op = require("sequelize").Op;
const sha512 = require("js-sha512");

const jwt = require("./jwt");

const Owner = require("@models").owner;
const Shop = require("@models").shop;

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

  const exist = await Owner.findAll({
    where: {
      [Op.or]: [{ id: req.body.id }, { email: req.body.email }]
    }
  }).catch(e => res.status(500).send({ success: -7 }));

  if (exist.length != 0) return res.status(409).json({ success: -6 });

  return await Owner.create({
    ID: req.body.id,
    USERNAME: req.body.username,
    EMAIL: req.body.email,
    PHONE: req.body.phone || null,
    PASSWORD: sha512(req.body.password)
  })
    .then(r => res.send({ success: 0 }))
    .catch(e => res.status(500).send({ success: -7 }));
};

exports.requireOwner = async (req, res, next) => {
  const decode = jwt.getDecodeData(req);

  if (decode && decode.type === "OWNER") {
    req.info = decode;
  } else return res.status(401).send("Unauthorized");

  return next();
};

exports.shopAuthCheck = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const user = req.info._id;

  const exist = await Shop.count({ where: { _id: id, OWNERID: user } });
  if (!exist) return res.status(403).send("Permission denied");

  return next();
};

/*
 *=========
 * Methods
 *=========
 */
exports.checkId = async id => {
  const exist = await Owner.findOne({ where: { ID: id } }).catch(err => {
    console.log(err);
  });
  return exist ? true : false;
};

exports.checkEmail = async email => {
  const exist = await Owner.findOne({ where: { EMAIL: email } }).catch(err => {
    console.log(err);
  });
  return exist ? true : false;
};

exports.existUser = async (name, idMode = "ID") => {
  if (idMode === "ID") return exports.checkId(name);
  return exports.checkEmail(name);
};

exports.getUser = async (mode, id) => {
  const owner = await Owner.findOne({
    where: { [mode]: id }
  }).catch(err => {
    console.log(err);
  });

  return {
    type: "OWNER",
    _id: owner._id,
    id: owner.ID,
    username: owner.USERNAME,
    email: owner.EMAIL
  };
};

exports.comparePassword = async (mode, id, password, callback) => {
  const owner = await Owner.findOne({
    where: { [mode]: id }
  }).catch(err => {
    console.log(err);
  });

  if (owner.PASSWORD === sha512(password)) return true;
  else return false;
};
