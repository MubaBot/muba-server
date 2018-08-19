const rp = require("request-promise");
const URL = process.env.CRWALER_URL;

/**
 * success
 *    0 : Create success
 *    1 : Server Error
 *   -1 : Keyword empty
 *   -2 : Exist keyword
 */
exports.reSearchKeyword = async (req, res) => {
  const keyword = req.body.keyword;
  console.log(keyword);

  if (!keyword || keyword == "") return res.status(412).json({ success: -1 });

  return rp({
    method: "PUT",
    uri: URL + "/works",
    body: {
      keyword: keyword
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "x-access-token": req.token
    },
    json: true
  })
    .then(result => res.json({ success: 0 }))
    .catch(err => {
      switch (err.response.body.success) {
        default:
          return res.status(500).json({ success: 1 });
      }
    });
};
