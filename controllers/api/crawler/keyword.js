const rp = require("request-promise");
const URL = process.env.CRWALER_URL;

exports.getList = async (req, res) => {
  return rp
    .get({
      uri: URL + "/keyword"
    })
    .then(result => res.send(result))
    .catch(err => res.status(500).send("Error"));
};

/**
 * success
 *    0 : Create success
 *   -1 : Keyword empty
 */
exports.createKeyword = async (req, res) => {
  const keyword = req.body.keyword;

  if (!keyword || keyword == "") return res.status(412).json({ success: -1 });

  return rp({
    method: "POST",
    uri: URL + "/keyword",
    body: {
      keyword: keyword
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "x-access-token": req.token
    },
    json: true
  })
    .then(result => {
      console.log(result);
      res.json({ success: 0 });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).send("Error");
    });
};
