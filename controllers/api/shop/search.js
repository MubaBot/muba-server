const models = require("@models");
const Sale = require("@models").sale;
const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;
const ShopOptions = require("@models").shop_options;
const ShopCrawler = require("@models").shop_crawler;
const ShopTempLatlng = require("@models").shop_temp_latlng;
const ShopMenuOptions = require("@models").shop_menu_options;

const User = require("@models").user;

const Review = require("@models").review;
const ReviewPhoto = require("@models").review_photo;

const Order = require("@models").order;
const OrderPush = require("@models").order_push;
const OrderMenu = require("@models").order_menu;
const OrderMenuOption = require("@models").order_menu_option;

const UserAddress = require("@models").user_address;

const moment = require("moment");
const Op = require("sequelize").Op;
const Fn = require("sequelize").fn;
const Col = require("sequelize").col;
const sequelize = require("sequelize");
const Literal = require("sequelize").literal;
const QueryTypes = require("sequelize").QueryTypes;

const SearchCount = 10;

exports.searchFood = async (req, res, next) => {
  const keyword = req.params.keyword;
  const page = req.params.page;
  const lat = req.params.lat;
  const lng = req.params.lng;

  const shops = await Shop.findAll({
    attributes: [
      "_id",
      "SHOPNAME",
      "ENDDATE",
      "OPEN",
      "PHONE",
      "POINT",
      [Literal(`(pow((\`ADDRLAT\` - ${lat}), 2) + pow((\`ADDRLNG\` - ${lng}), 2))`), "distance"]
    ],
    include: [{ model: ShopMenu, where: { MENUNAME: { [Op.like]: `%${keyword}%` } } }, { model: Review, attributes: ["_id"], required: false }],
    offset: (page - 1) * SearchCount,
    limit: SearchCount,
    order: [Literal(`\`ENDDATE\` >= '${moment().format("YYYY-MM-DD")}' DESC`), ["OPEN", "DESC"], Literal("distance ASC")]
  }).catch(err => {
    console.log(err);
    return [];
  });

  return res.json({ success: 0, lists: shops });
};

exports.searchRand = async (req, res, next) => {
  const page = req.params.page;
  const lat = req.params.lat;
  const lng = req.params.lng;

  const shops = await Shop.findAll({
    attributes: ["_id", "SHOPNAME", "ENDDATE", "OPEN", "PHONE", "POINT"],
    include: [{ model: ShopMenu, required: false }, { model: Review, attributes: ["_id"], required: false }],
    where: Literal(`(pow((\`ADDRLAT\` - ${lat}), 2) + pow((\`ADDRLNG\` - ${lng}), 2)) <= 0.0015`),
    offset: (page - 1) * SearchCount,
    limit: SearchCount,
    order: [Fn("RAND")]
  }).catch(err => {
    console.log(err);
    return [];
  });

  return res.json({ success: 0, lists: shops });
};
