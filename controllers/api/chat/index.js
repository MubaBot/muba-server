const request = require("./request");

const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;

const querystring = require("querystring");

const SearchCount = 10;

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

  return request({
    method: "GET",
    url: "/chatbot/api/get_message?" + querystring.stringify({ text, scenario, intent_history, argv }),
    token: req.token,
    then: result => res.json({ success: 0, result }),
    error: err => res.status(500).json({ success: err.response.body.success })
  });
};

exports.updateChatbotData = async (req, res, next) => {
  const page = req.params.page;
  const shops = await Shop.findAll({ include: [{ model: ShopMenu, required: false }], offset: page * SearchCount, limit: SearchCount }).catch(err =>
    res.status(500).json({ success: -1 })
  );

  try {
    for (var i in shops) {
      const shop = shops[i];
      await insertChatbotShopInfo(shop._id, shop.SHOPNAME, shop.shop_menus);
    }

    return res.json({ success: 0 });
  } catch (err) {
    return res.status(500).json({ success: -2 });
  }
};

/**
 * Methods
 */

const insertChatbotShopInfo = (exports.insertChatbotShopInfo = async (ID, SHOPNAME, MENU) => {
  let menus = [];
  for (var i in MENU) {
    const menu = MENU[i];
    if (menu.MENUNAME) menus.push(menu.MENUNAME);
    else menus.push(menu);
  }

  return request({
    method: "POST",
    url: "/chatbot/db_manage/add_restaurant",
    formData: { shop_id: ID, restaurant_name: SHOPNAME, menu: JSON.stringify(menus) },
    then: () => true,
    error: err => Promise.reject(err)
  });
});

exports.updateChatbotShopInfo = async (ID, SHOPNAME, MENU) => {
  let menus = [];
  for (var i in MENU) {
    const menu = MENU[i];
    if (menu.MENUNAME) menus.push(menu.MENUNAME);
    else menus.push(menu);
  }

  return request({
    method: "PUT",
    url: "/chatbot/db_manage/change_restaurant_name",
    formData: { shop_id: ID, restaurant_name: SHOPNAME, menu: JSON.stringify(menus) },
    then: () => true,
    error: err => Promise.reject(err)
  });
};

exports.deleteChatbotShop = async ID => {
  return request({
    method: "GET",
    url: "/chatbot/db_manage/item_delete?table=restaurant&id=" + ID,
    then: () => true,
    error: err => Promise.reject(JSON.stringify(err))
  });
};
