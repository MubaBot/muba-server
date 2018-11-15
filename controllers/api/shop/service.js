const models = require("@models");
const Shop = require("@models").shop;
const ShopServiceRequest = require("@models").shop_service_request;

const moment = require("moment");
const Op = require("sequelize").Op;
const Fn = require("sequelize").fn;
const Col = require("sequelize").col;
const sequelize = require("sequelize");
const Literal = require("sequelize").literal;
const QueryTypes = require("sequelize").QueryTypes;

const SearchCount = 10;
const ServicePrice = 300;

exports.getServicePrice = (req, res, next) => res.json({ success: 0, price: ServicePrice });

exports.requestShopService = async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const day = req.body.day;
  const account = req.body.account;

  if (day < 30) return res.status(412).json({ success: -1 });

  return ShopServiceRequest.create({ SHOPID: id, USERNAME: name, ACCOUNT: account, DAY: day, PRICE: day * ServicePrice })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.getRequestList = async (req, res, next) => {
  const page = req.params.page;
  try {
    const requests = await ShopServiceRequest.findAll({
      include: [{ model: Shop }],
      offset: (page - 1) * SearchCount,
      limit: SearchCount,
      order: [[Fn("isnull", Col("ADMISSION")), "DESC"], ["_id", "DESC"]]
    });

    const count = ShopServiceRequest.count({});
    return res.json({ success: 0, count: count, displayCount: SearchCount, lists: requests });
  } catch (err) {
    console.log("@api/shop/service.js:getRequestList", err);
    return res.status(500).json({ success: -1 });
  }
};
exports.allowRequest = async (req, res, next) => {
  const request = req.params.request;

  const service = await ShopServiceRequest.findOne({ where: { _id: request, ADMISSION: null } });
  if (!service) return res.status(404).json({ success: 1 });

  return models.sequelize.transaction(async t => {
    try {
      await ShopServiceRequest.update({ ADMISSION: true }, { where: { _id: request }, transaction: t });
      const shop = await Shop.findOne({ where: { _id: service.SHOPID }, transaction: t });
      if (!shop) return (() => Promise.reject())();

      var date = null;

      if (
        moment(shop.ENDDATE)
          .add(1, "days")
          .unix() < moment().unix()
      )
        date = moment.utc();
      else date = moment(shop.ENDDATE).utc();

      await Shop.update({ ENDDATE: date.add(service.DAY, "days").toDate() }, { where: { _id: shop._id }, transaction: t });

      return res.json({ success: 0 });
    } catch (exception) {
      console.log(exception);
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};

exports.refuseRequest = async (req, res, next) => {
  const request = req.params.request;

  const service = await ShopServiceRequest.findOne({ where: { _id: request, ADMISSION: null } });
  if (!service) return res.status(404).json({ success: 1 });

  return ShopServiceRequest.update({ ADMISSION: false }, { where: { _id: request } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};
