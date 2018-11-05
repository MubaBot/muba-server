const Shop = require("@models").shop;
const Sale = require("@models").sale;
const ShopMenu = require("@models").shop_menu;
const ShopAddress = require("@models").shop_address;

const moment = require("moment");

const Op = require("sequelize").Op;

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

  const sales = await Sale.findAll({
    include: [{ model: ShopMenu }, { model: Shop, include: [{ model: ShopAddress }] }],
    where: {
      [Op.and]: [
        { [Op.or]: [{ USEDATE: false }, { [Op.and]: [{ STARTDAY: { [Op.lte]: nowDate } }, { ENDDAY: { [Op.gte]: endDate } }] }] },
        { [Op.or]: [{ USETIME: false }, { [Op.and]: [{ STARTTIME: { [Op.lte]: nowTime } }, { ENDTIME: { [Op.gte]: endTime } }] }] },
        { [Op.or]: [{ LIMIT: -1 }, { COUNT: { [Op.gt]: 0 } }] }
      ]
    },
    offset: (page - 1) * SearchCount,
    limit: SearchCount
  });

  return res.json({ success: 0, lists: sales });
};
