const jwt = require("jsonwebtoken");

const secretKey = "test1234";

const sign = (exports.sign = ({ iat, exp, ...data }) => {
  // Todo: encode RSA
  return jwt.sign(
    {
      ...data
    },
    secretKey,
    { expiresIn: "1d" }
  );
});

const verify = (exports.verify = token => {
  try {
    // Todo: decode RSA
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    console.log(JSON.stringify(err));
    if (err.name === "TokenExpiredError") return "TokenExpiredError";
    return null;
  }
});

exports.refreshToken = req => {
  req.token = sign({ ...jwt.decode(req.token) });
  return verify(req.token);
};

exports.getDecodeData = req => {
  req.token = req.headers["x-access-token"];

  if (!req.token) {
    req.isLogin = false;
    return null;
  }

  return verify(req.token);
};
