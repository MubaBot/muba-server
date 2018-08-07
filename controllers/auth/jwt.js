const jwt = require('jsonwebtoken');

const secretKey = 'test1234';

exports.sign = ({ ...data }) => {
  return jwt.sign({
    ...data
  }, secretKey, { expiresIn: '1d' });
};

exports.requireLogin = (req, res) => {

}

exports.isAdmin = (req, res, next) => {

}

exports.verify = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null;
  }
}
