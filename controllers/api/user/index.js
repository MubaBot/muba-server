const User = require("@models").user;
const UserAddress = require("@models").user_address;

/**
 * Routers
 */
exports.getAddress = async (req, res, next) => {
  const test = await getAddress(req.info._id);
  console.log(test);
  return res.json({ test: "test" });
};

exports.setAddress = async (req, res, next) => {
  UserAddress.create({
    USERID: 1,
    ADDRESS1: "123",
    ADDRESS2: "123"
  });

  return res.json({ test: "test" });
};

/**
 * Methods
 */

const getAddress = async id => {
  return UserAddress.findAll({ where: { USERID: id } });
};
