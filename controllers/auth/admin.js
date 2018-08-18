const Op = require('sequelize').Op;
const sha512 = require('js-sha512');

const Admin = require('@models').admin;

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
  if (!req.body.data.id) return res.status(412).json({ success: -1 });
  if (!req.body.data.username) return res.status(412).json({ success: -2 });
  if (!req.body.data.email) return res.status(412).json({ success: -3 });
  if (!req.body.data.password || !req.body.data.repassword) return res.status(412).json({ success: -4 });

  if (req.body.data.password != req.body.data.repassword) return res.status(412).json({ success: -5 });

  const exist = await Admin.findAll({
    where: {
      [Op.or]: [
        { id: req.body.data.id },
        { email: req.body.data.email }
      ]
    }
  }).catch(e => res.status(500).send({ success: -7 }));

  if (exist.length != 0) return res.status(412).json({ success: -6 });

  return await Admin.create({
    ID: req.body.data.id,
    USERNAME: req.body.data.username,
    EMAIL: req.body.data.email,
    PASSWORD: sha512(req.body.data.password)
  })
    .then(r => res.send({ success: 0 }))
    .catch(e => res.status(500).send({ success: -7 }));
}

/**
 * exist
 *    true : At least one user exists.
 *   false : User does not exist.
 */
exports.existAdminUser = async (req, res, next) => {
  const exist = await Admin.findAll({});

  if (exist.length != 0) return res.json({ exist: true });
  return res.json({ exist: false });
}

/*
 *=========
 * Methods
 *=========
 */
exports.checkId = async (id) => {
  const exist = await Admin.findOne({ where: { ID: id } });
  return exist ? true : false;
}

exports.checkEmail = async (email) => {
  const exist = await Admin.findOne({ where: { EMAIL: email } });
  return exist ? true : false;
}

exports.existUser = async (name, idMode = 'ID') => {
  if (idMode === 'ID') return exports.checkId(name);
  return exports.checkEmail(name);
};

exports.getUser = async (mode, id) => {
  const admin = await Admin.findOne({
    where: { [mode]: id }
  });

  return {
    type: 'ADMIN',
    id: admin.ID,
    username: admin.USERNAME,
    email: admin.EMAIL
  }
}

exports.comparePassword = async (mode, id, password, callback) => {
  const admin = await Admin.findOne({
    where: { [mode]: id }
  });

  if (admin.PASSWORD === sha512(password)) return true;
  else return false;
}