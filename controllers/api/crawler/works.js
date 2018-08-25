const request = require("@controllers/request");

/**
 * success
 *    0 : Create success
 *   -1 : page empty
 *   -2 : page is not numeric
 */
exports.getList = async (req, res, next) => {
  const page = req.params.page;

  if (!page) return res.status(412).json({ success: -1 });
  if (!/^[\d]*$/.test(page)) return res.status(412).json({ success: -2 });

  return request({
    method: "GET",
    url: "/queue/list/" + page,
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: -1 })
  });
};

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

exports.deleteWorkingById = async (req, res, next) => {
  const id = req.params.id;
  if (!id || id == "") return res.status(412).json({ success: -1 });

  return request({
    method: "DELETE",
    url: "/queue/" + id,
    token: req.token,
    then: result => res.json({ success: 0 }),
    error: err => {
      switch (err.response.body.success) {
        default:
          return res.status(500).json({ success: 1 });
      }
    }
  });
};

exports.deleteWorkingAll = async (req, res, next) => {
  console.log("all remove");
  return request({
    method: "DELETE",
    url: "/queue/all",
    token: req.token,
    then: result => res.json({ success: 0 }),
    error: err => {
      switch (err.response.body.success) {
        default:
          return res.status(500).json({ success: 1 });
      }
    }
  });
};
