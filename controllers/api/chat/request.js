const rp = require("request-promise");
const URL = process.env.CHATBOT_URL;

module.exports = async ({ method, url, token, then, error, body, ...params }) =>
  rp({
    method: method,
    uri: URL + url,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "x-access-token": token
    },
    body,
    json: true,
    ...params
  })
    .then(then)
    .catch(error);
