const request = require("./request");

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
    url: "/contents/list/" + page,
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: -1 })
  });
};

exports.getContentById = async (req, res) => {
  const id = req.params.id;

  if (!id || id == "") return res.status(412).json({ success: -1 });

  return request({
    method: "GET",
    url: "/contents/" + id,
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: 1 })
  });
};

exports.deleteContent = async (req, res) => {
  const id = req.body.id;
  if (!id || id == "") return res.status(412).json({ success: -1 });

  return request({
    method: "DELETE",
    url: "/contents/" + id,
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
