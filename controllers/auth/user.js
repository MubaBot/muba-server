const Op = require("sequelize").Op;
const sha512 = require("js-sha512");

const User = require("@models").user;

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

  const exist = await User.findAll({
    where: {
      [Op.or]: [{ id: req.body.id }, { email: req.body.email }]
    }
  }).catch(e => res.status(500).send({ success: -7 }));

  if (exist.length != 0) return res.status(409).json({ success: -6 });

  return await User.create({
    ID: req.body.id,
    USERNAME: req.body.username,
    EMAIL: req.body.email,
    PHONE: req.body.phone || null,
    PASSWORD: sha512(req.body.password)
  })
    .then(r => res.send({ success: 0 }))
    .catch(e => res.status(500).send({ success: -7 }));
};

exports.getUserMemberList = async (req, res, next) => {
  const page = req.params.page;

  const user = await User.findAll({
    offset: (page - 1) * ShowCount,
    limit: ShowCount
  });

  const count = await User.count({});

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: user });
};

exports.allowUser = async (req, res, next) => {
  const id = req.params.id;

  return User.update({ BLOCK: false }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.blockUser = async (req, res, next) => {
  const id = req.params.id;

  return User.update({ BLOCK: true }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

/*
 *=========
 * Methods
 *=========
 */
exports.checkId = async id => {
  const exist = await User.findOne({ where: { ID: id, BLOCK: false } }).catch(err => {
    console.log(err);
  });
  return exist ? true : false;
};

exports.checkEmail = async email => {
  const exist = await User.findOne({ where: { EMAIL: email, BLOCK: false } }).catch(err => {
    console.log(err);
  });
  return exist ? true : false;
};

exports.existUser = async (name, idMode = "ID") => {
  if (idMode === "ID") return exports.checkId(name);
  return exports.checkEmail(name);
};

exports.getUser = async (mode, id) => {
  const user = await User.findOne({
    where: { [mode]: id }
  }).catch(err => {
    console.log(err);
  });

  return {
    type: "USER",
    _id: user._id,
    id: user.ID,
    username: user.USERNAME,
    email: user.EMAIL,
    phone: user.PHONE,
    gender: user.GENDER,
    birth: user.BIRTH,
    address: user.ADDRESS
  };
};

exports.comparePassword = async (mode, id, password, callback) => {
  const user = await User.findOne({
    where: { [mode]: id }
  }).catch(err => {
    console.log(err);
  });

  if (user.PASSWORD === sha512(password)) return true;
  else return false;
};
