const request = require("@controllers/request");

/**
 * success
 *    0 : Create success
 *    1 : Server Error
 *   -1 : Keyword empty
 *   -2 : Exist keyword
 */
exports.reSearchKeyword = async (req, res) => {
  const keyword = req.body.keyword;
  if (!keyword || keyword == "") return res.status(412).json({ success: -1 });

  return request({
    method: "PUT",
    url: "/works",
    token: req.token,
    body: { keyword: keyword },
    then: result => res.json({ success: 0 }),
    error: err => {
      switch (err.response.body.success) {
        default:
          return res.status(500).json({ success: 1 });
      }
    }
  });
};
