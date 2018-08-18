const rp = require("request-promise");
const URL = process.env.CRWALER_URL;

/**
 * success
 *    0 : Create success
 *   -1 : page empty
 *   -2 : page is not numeric
 */
exports.getList = async (req, res) => {
  const page = req.params.page;

  if (!page) return res.status(412).json({ success: -1 });
  if (!/^[\d]*$/.test(page)) return res.status(412).json({ success: -2 });

  return rp
    .get({
      uri: URL + "/keyword/list/" + page,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "x-access-token": req.token
      }
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
