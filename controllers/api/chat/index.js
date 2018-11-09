const request = require("./request");
const querystring = require("querystring");

exports.doChat = async (req, res, next) => {
  const text = req.body.text;
  const scenario = req.body.scenario;
  const intent_history = req.body.intent_history;
  const argv = req.body.argv;
  const id = req.info._id;

  if (!text) return res.status(412).json({ success: -1 });
  if (!scenario) return res.status(412).json({ success: -2 });
  if (!intent_history) return res.status(412).json({ success: -3 });
  if (!argv) return res.status(412).json({ success: -4 });

  const a = JSON.parse(argv);
  if (parseInt(a.user, 10) !== id) return res.status(403).json({ success: -5 });

  console.log(req.body);

  return request({
    method: "GET",
    url: "/chatbot/api/get_message?" + querystring.stringify({ text, scenario, intent_history, argv }),
    token: req.token,
    then: result => res.json({ success: 0, result }),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};
