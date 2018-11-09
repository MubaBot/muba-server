const request = require("./request");

exports.getSearchConfigList = async (req, res) => {
  return request({
    method: "GET",
    url: "/config/search",
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.insertSearchConfig = async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const url = req.body.url;
  const query = req.body.query;
  const tag = req.body.tag;
  const page = req.body.page;
  const count = req.body.count;
  const start = req.body.start;

  if (!id) return res.status(412).json({ success: -1 });
  if (!name) return res.status(412).json({ success: -2 });
  if (!url) return res.status(412).json({ success: -3 });
  if (!query) return res.status(412).json({ success: -4 });
  if (!tag) return res.status(412).json({ success: -5 });
  if (!page) return res.status(412).json({ success: -6 });
  if (!/^[\d]*$/.test(count)) return res.status(412).json({ success: -7 });
  if (!/^[\d]*$/.test(start)) return res.status(412).json({ success: -8 });

  return request({
    method: "POST",
    url: "/config/search",
    body: { id, name, url, query, tag, page, count, start },
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.appendSearchMode = async (req, res, next) => {
  const _id = req.params.id;
  const id = req.body.id;
  const name = req.body.name;
  const param = req.body.param;
  const value = req.body.value;

  if (!id) return res.status(412).json({ success: -1 });
  if (!name) return res.status(412).json({ success: -2 });
  if (!param) return res.status(412).json({ success: -3 });
  if (!value) return res.status(412).json({ success: -4 });

  return request({
    method: "POST",
    url: "/config/search/" + _id,
    body: { id, name, param, value },
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.removeSearchConfig = async (req, res) => {
  const id = req.params.id;

  return request({
    method: "DELETE",
    url: "/config/search/" + id,
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.removeMode = async (req, res) => {
  const id = req.params.id;
  const mode = req.params.mode;

  return request({
    method: "DELETE",
    url: ["/config/search", id, mode].join("/"),
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.getContentConfigList = async (req, res) => {
  return request({
    method: "GET",
    url: "/config/content",
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.insertContentConfig = async (req, res) => {
  const domain = req.body.domain;
  const title = req.body.title;
  const content = req.body.content;
  const comment = req.body.comment;

  if (!domain) return res.status(412).json({ success: -1 });
  if (!title) return res.status(412).json({ success: -2 });
  if (!content) return res.status(412).json({ success: -3 });
  if (!comment) return res.status(412).json({ success: -4 });

  return request({
    method: "POST",
    url: "/config/content",
    body: { domain, title, content, comment },
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.updateContentConfig = async (req, res) => {
  const domain = req.params.domain;
  const title = req.body.title;
  const content = req.body.content;
  const comment = req.body.comment;

  if (!domain) return res.status(412).json({ success: -1 });
  if (!title) return res.status(412).json({ success: -2 });
  if (!content) return res.status(412).json({ success: -3 });
  if (!comment) return res.status(412).json({ success: -4 });

  return request({
    method: "PUT",
    url: "/config/content/" + domain,
    body: { title, content, comment },
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.removeContentConfig = async (req, res) => {
  const id = req.params.id;

  return request({
    method: "DELETE",
    url: "/config/content/" + id,
    token: req.token,
    then: result => res.json(result),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};
