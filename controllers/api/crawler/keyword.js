const request = require("@controllers/request");

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

  return request({
    method: "GET",
    url: "/keyword/list/" + page,
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).send("Error")
  });
};

/**
 * success
 *    0 : Create success
 *   -1 : Keyword empty
 *   -2 : Exist keyword
 */
exports.createKeyword = async (req, res) => {
  const keyword = req.body.keyword;

  if (!keyword || keyword == "") return res.status(412).json({ success: -1 });

  return request({
    method: "POST",
    url: "/keyword",
    token: req.token,
    body: { keyword: keyword },
    then: result => res.json({ success: 0 }),
    error: err => {
      switch (err.response.body.success) {
        case -1:
          return res.status(412).json({ success: -1 });
        case -2:
          return res.status(409).json({ success: -2 });
        default:
          return res.status(500).json({ success: 1 });
      }
    }
  });
};

exports.deleteKeyword = async (req, res, nex) => {
  const keyword = req.body.keyword;

  if (!keyword || keyword == "") return res.status(412).json({ success: -1 });

  return request({
    method: "DELETE",
    url: "/keyword",
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
