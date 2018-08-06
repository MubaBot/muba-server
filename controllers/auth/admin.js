const Op = require('sequelize').Op;
const sha512 = require('js-sha512');

const Admin = require('../../models').admin;

exports.register = async (req, res, next) => {
  console.log(req.body.data);

  if (!req.body.data.id) return res.json({ success: -1 }); // id empty
  if (!req.body.data.username) return res.json({ success: -2 }); // username empty
  if (!req.body.data.email) return res.json({ success: -3 }); // email empty

  if (req.body.data.password != req.body.data.repassword) return res.json({ success: -4 }); // password not match

  const exist = await Admin.findAll({
    where: {
      [Op.or]: [
        { id: req.body.data.id },
        { username: req.body.data.username },
        { email: req.body.data.email }
      ]
    }
  });

  if (exist.length != 0) return res.json({ success: -5 }); // exist user

  return await Admin.create({
    ID: req.body.data.id,
    USERNAME: req.body.data.username,
    EMAIL: req.body.data.email,
    PASSWORD: sha512(req.body.data.password)
  })
    .then(r => res.send({ success: 0 })) // success
    .catch(e => res.send({ success: -6 })); // db error
}