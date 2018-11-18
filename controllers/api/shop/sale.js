const Sale = require("@models").sale;
const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;

const moment = require("moment");

const Op = require("sequelize").Op;
const Fn = require("sequelize").fn;
const Col = require("sequelize").col;
const sequelize = require("sequelize");
const Literal = require("sequelize").literal;
const QueryTypes = require("sequelize").QueryTypes;

const SearchCount = 10;

exports.searchSaleShops = async (req, res, next) => {
  const page = req.params.page;
  const lat = req.params.lat;
  const lng = req.params.lng;
  const time = req.params.time;

  const nowDate = parseInt(
    moment()
      .add(parseInt(time), "hours")
      .format("YYYYMMDD")
  );
  const endDate = parseInt(
    moment()
      .add(parseInt(time) + 1, "hours")
      .format("YYYYMMDD")
  );
  const nowTime = parseInt(
    moment()
      .add(parseInt(time), "hours")
      .format("HHmm")
  );
  const endTime = parseInt(
    moment()
      .add(parseInt(time) + 1, "hours")
      .format("HHmm")
  );

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
    include: [
      {
        model: ShopMenu,
        include: [
          {
            model: Sale,
            where: {
              [Op.and]: [
                { [Op.or]: [{ USEDATE: false }, { [Op.and]: [{ STARTDAY: { [Op.lte]: nowDate } }, { ENDDAY: { [Op.gte]: endDate } }] }] },
                { [Op.or]: [{ USETIME: false }, { [Op.and]: [{ STARTTIME: { [Op.lte]: nowTime } }, { ENDTIME: { [Op.gte]: endTime } }] }] },
                { [Op.or]: [{ LIMIT: -1 }, { COUNT: { [Op.gt]: 0 } }] }
              ]
            }
          }
        ]
      }
    ],
    offset: (page - 1) * SearchCount,
    limit: SearchCount,
    order: [Literal(`\`ENDDATE\` >= '${moment().format("YYYY-MM-DD")}' DESC`), ["OPEN", "DESC"], Literal("distance ASC")]
  }).catch(err => {
    console.log(err);
    return [];
  });

  return res.json({ success: 0, lists: shops });
};
