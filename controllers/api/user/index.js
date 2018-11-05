const User = require("@models").user;
const UserAddress = require("@models").user_address;

/**
 * Routers
 */

exports.getUserInfo = async (req, res, next) => {
  const id = req.info._id;

  return User.findOne({
    include: [{ model: UserAddress }],
    where: { _id: id },
    // attributes: ["_id", "PHONE", "GENDER", "BIRTH", "USERNAME"]
  })
    .then(user => res.json({ success: 0, user: user }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.setUserInfo = async (req, res, next) => {
  const id = req.info._id;
  const phone = req.body.phone;
  const gender = req.body.gender;
  const birth = req.body.birth;
  const name = req.body.name;

  return User.update({ USERNAME: name, PHONE: phone, GENDER: gender, BIRTH: birth }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.getAddress = async (req, res, next) => {
  // const test = await getAddress(req.info._id);
  // console.log(test);
  return res.json({ test: "test" });
};

exports.setAddress = async (req, res, next) => {
  // UserAddress.create({
  //   USERID: 1,
  //   ADDRESS1: "123",
  //   ADDRESS2: "123"
  // });

  return res.json({ test: "test" });
};
/**
 * Methods
 */

const getAddress = async id => {
  return UserAddress.findAll({ where: { USERID: id } });
};
