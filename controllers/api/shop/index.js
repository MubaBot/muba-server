const models = require("@models");
const Sale = require("@models").sale;
const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;
const ShopAddress = require("@models").shop_address;
const ShopOptions = require("@models").shop_options;
const ShopCrawler = require("@models").shop_crawler;
const ShopTempLatlng = require("@models").shop_temp_latlng;
const ShopMenuOptions = require("@models").shop_menu_options;

const Order = require("@models").order;
const OrderPush = require("@models").order_push;
const OrderMenu = require("@models").order_menu;
const OrderMenuOption = require("@models").order_menu_option;

const moment = require("moment");
const Op = require("sequelize").Op;
const Fn = require("sequelize").fn;
const Col = require("sequelize").col;

const SearchCount = 10;
const LatLngUpdateCount = 1;

exports.getShopInfo = async (req, res, next) => {
  const nowDate = parseInt(moment().format("YYYYMMDD"));
  const nowTime = parseInt(moment().format("HHmm"));

  const id = req.params.id;
  const shop = await Shop.findOne({
    include: [
      { model: ShopAddress },
      {
        model: ShopMenu,
        include: [
          {
            model: Sale,
            where: {
              [Op.and]: [
                { [Op.or]: [{ USEDATE: false }, { [Op.and]: [{ STARTDAY: { [Op.lte]: nowDate } }, { ENDDAY: { [Op.gte]: nowDate } }] }] },
                { [Op.or]: [{ USETIME: false }, { [Op.and]: [{ STARTTIME: { [Op.lte]: nowTime } }, { ENDTIME: { [Op.gte]: nowTime } }] }] },
                { [Op.or]: [{ LIMIT: -1 }, { COUNT: { [Op.gt]: 0 } }] }
              ]
            },
            required: false
          },
          {
            model: ShopMenuOptions,
            required: false,
            include: [{ model: ShopOptions }]
          }
        ]
      }
    ],
    where: { _id: id },
    order: [[ShopMenu, "_id", "ASC"], [ShopMenu, Sale, "PRICE", "ASC"], [ShopMenu, ShopMenuOptions, ShopOptions, "OPTIONNAME", "ASC"]]
  });

  return res.json({ success: 0, shop: shop });
};

exports.getShopSaleInfo = async (req, res, next) => {
  const sid = req.params.id;
  const mid = req.params.menu;

  const menu = await ShopMenu.findOne({ where: { SHOPID: sid, _id: mid }, attributes: ["MENUNAME", "PRICE"] });
  if (!menu) return res.status(404).json({ success: 1 });

  const sales = await Sale.findAll({ where: { SHOPID: sid, MENUID: mid } });

  return res.json({ success: 0, name: menu.MENUNAME, price: menu.PRICE, list: sales });
};

exports.getShopOptionInfo = async (req, res, next) => {
  const sid = req.params.id;
  const mid = req.params.menu;

  const menu = await ShopMenu.findOne({ where: { SHOPID: sid, _id: mid }, attributes: ["MENUNAME", "PRICE"] });
  if (!menu) return res.status(404).json({ success: 1 });

  const options = await ShopOptions.findAll({
    include: [
      {
        model: ShopMenuOptions,
        required: false,
        where: {
          MENUID: mid
        },
        attributes: ["_id"]
      }
    ],
    where: { SHOPID: sid }
  });
  return res.json({ success: 0, name: menu.MENUNAME, list: options });
};

exports.getShopOwnerCount = async (req, res, next) => {
  return res.json({ success: 0 });
};

exports.searchShops = async (req, res, next) => {
  const keyword = req.params.keyword;
  const page = req.params.page;

  const shops = await Shop.findAll({
    include: [
      {
        model: ShopAddress
      },
      {
        model: ShopMenu,
        attributes: ["_id"],
        where: {
          [Op.or]: [{ MENUNAME: { [Op.like]: `%${keyword}%` } }, { "$shop.SHOPNAME$": { [Op.like]: `%${keyword}%` } }]
        }
      }
    ],
    offset: (page - 1) * SearchCount,
    limit: SearchCount
  });

  return res.json({ success: 0, lists: shops });
};

exports.addShopMenu = async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const sold = req.body.sold;

  const exist = await ShopMenu.findOne({ where: { SHOPID: id, MENUNAME: name } });
  if (exist) return res.status(409).json({ success: -1 });

  return ShopMenu.create({ SHOPID: id, MENUNAME: name, PRICE: price, SOLD: sold })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};

exports.addShopMenuSale = async (req, res, next) => {
  const params = {
    id: req.params.id,
    menu: req.params.menu,
    ...req.body
  };

  const menu = ShopMenu.findOne({ where: { _id: params.menu, SHOPID: params.id } });
  if (!menu) return res.status(404).json({ success: 1 });

  // todo: 겹치는 시간 체크

  return Sale.create({
    SHOPID: params.id,
    MENUID: params.menu,
    LIMIT: params.useLimit ? params.limit : -1,
    COUNT: params.useLimit ? params.limit : 999,
    PRICE: params.price,
    USEDATE: params.useDate,
    STARTDAY: parseInt(params.startDate),
    ENDDAY: parseInt(params.endDate),
    USETIME: params.useTime,
    STARTTIME: parseInt(params.startTime),
    ENDTIME: parseInt(params.endTime)
  })
    .then(() => res.json({ success: 0, ...req.body }))
    .catch(err => res.status(500).json({ success: 1 }));
};

exports.deleteShopMenuSale = async (req, res, next) => {
  const shop = req.params.id;
  const menu = req.params.menu;
  const sale = req.params.sale;

  const exist = await Sale.findOne({ where: { SHOPID: shop, MENUID: menu, _id: sale } });
  if (!exist) return res.status(404).json({ success: -1 });

  return Sale.destroy({ where: { SHOPID: shop, MENUID: menu, _id: sale } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};

exports.modifyShopMenuSale = async (req, res, next) => {
  const params = {
    id: req.params.id,
    menu: req.params.menu,
    sale: req.params.sale,
    ...req.body
  };

  const menu = ShopMenu.findOne({ where: { _id: params.menu, SHOPID: params.id } });
  if (!menu) return res.status(404).json({ success: 1 });

  const sale = Sale.findOne({ where: { _id: params.sale, SHOPID: params.id, MENUID: params.menu } });
  if (!sale) return res.status(404).json({ success: 1 });

  // todo: 겹치는 시간 체크

  return Sale.update(
    {
      PRICE: params.price,
      USEDATE: params.useDate,
      STARTDAY: parseInt(params.startDate),
      ENDDAY: parseInt(params.endDate),
      USETIME: params.useTime,
      STARTTIME: parseInt(params.startTime),
      ENDTIME: parseInt(params.endTime)
    },
    {
      where: {
        _id: params.sale
      }
    }
  )
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: 1 }));
};

exports.addShopOption = async (req, res, next) => {
  const id = req.params.id;

  const menu = req.body.menu;
  const name = req.body.name;
  const price = req.body.price;
  const use = req.body.use;

  return models.sequelize.transaction(async t => {
    try {
      const option = await ShopOptions.create({ SHOPID: id, OPTIONNAME: name, PRICE: price }, { transaction: t });
      if (use === true) await ShopMenuOptions.create({ SHOPID: id, OPTIONID: option._id, MENUID: menu }, { transaction: t });

      return res.json({ success: 0 });
    } catch (exception) {
      console.log(exception);
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};

exports.modifyShopOption = async (req, res, next) => {
  const id = req.params.id;
  const option = req.params.option;

  const menu = req.body.menu;
  const price = req.body.price;
  const use = req.body.use;

  return models.sequelize.transaction(async t => {
    try {
      await ShopOptions.update({ PRICE: price }, { where: { _id: option }, transaction: t });
      const exist = await ShopMenuOptions.findOne({ where: { OPTIONID: option, MENUID: menu, SHOPID: id }, transaction: t });

      if (exist && use === false) await ShopMenuOptions.destroy({ where: { OPTIONID: option, MENUID: menu, SHOPID: id } }, { transaction: t });
      else if (!exist && use === true) await ShopMenuOptions.create({ SHOPID: id, OPTIONID: option, MENUID: menu }, { transaction: t });

      return res.json({ success: 0 });
    } catch (exception) {
      console.log(exception);
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};

exports.deleteShopOption = async (req, res, next) => {
  const id = req.params.id;
  const option = req.params.option;

  return ShopOptions.destroy({ where: { SHOPID: id, _id: option } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: 1 }));
};

exports.modifyShopMenu = async (req, res, next) => {
  const id = req.params.id;
  const menu = req.params.menu;
  const name = req.body.name;
  const price = req.body.price;
  const sold = req.body.sold;

  const exist = await ShopMenu.findOne({ where: { _id: menu } });
  if (!exist) return res.status(404).json({ success: -1 });

  if (exist.MENUNAME !== name) {
    const newMenu = await ShopMenu.findOne({ where: { SHOPID: id, MENUNAME: name } });
    if (newMenu) return res.status(409).json({ success: -1 });
  }

  return ShopMenu.update({ SHOPID: id, MENUNAME: name, PRICE: price, SOLD: sold }, { where: { _id: menu } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};

exports.deleteShopMenu = async (req, res, next) => {
  const id = req.params.id;
  const menu = req.params.menu;

  const exist = await ShopMenu.findOne({ where: { SHOPID: id, _id: menu } });
  if (!exist) return res.status(404).json({ success: -1 });

  return ShopMenu.destroy({ where: { _id: menu } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};

const insertShop = shop => {
  models.sequelize.transaction(async t => {
    try {
      const s = await Shop.create({ OWNERID: null, SHOPNAME: shop.name, PHONE: shop.tel }, { transaction: t });
      await ShopAddress.create({ SHOPID: s._id, ADDRESS: JSON.stringify(shop.place) }, { transaction: t });
      await ShopCrawler.create({ SHOPID: s._id, SEARCHURL: shop.url }, { transaction: t });

      for (var i in shop.menus) await ShopMenu.create({ SHOPID: s._id, MENUNAME: shop.menus[i].name, PRICE: shop.menus[i].price }, { transaction: t });

      return true;
    } catch (exception) {
      console.log(exception);
      t.rollback();
      return false;
    }
  });
};

exports.createShops = async (req, res, next) => {
  for (let i in req.body.shops) {
    const shop = req.body.shops[i];
    const exist = await ShopCrawler.findOne({ where: { SEARCHURL: shop.url } });
    if (exist) continue;

    insertShop(shop);
  }

  return res.json({ success: 0 });
};

const getShopMenuWithSaleWithTransaction = async (id, transaction) => {
  const nowDate = parseInt(moment().format("YYYYMMDD"));
  const nowTime = parseInt(moment().format("HHmm"));

  return ShopMenu.findOne(
    {
      include: [
        {
          model: Sale,
          where: {
            [Op.and]: [
              { [Op.or]: [{ USEDATE: false }, { [Op.and]: [{ STARTDAY: { [Op.lte]: nowDate } }, { ENDDAY: { [Op.gte]: nowDate } }] }] },
              { [Op.or]: [{ USETIME: false }, { [Op.and]: [{ STARTTIME: { [Op.lte]: nowTime } }, { ENDTIME: { [Op.gte]: nowTime } }] }] },
              { [Op.or]: [{ LIMIT: -1 }, { COUNT: { [Op.gt]: 0 } }] }
            ]
          },
          required: false,
          attributes: ["_id", "LIMIT", "COUNT", "PRICE"]
        }
      ],
      where: { _id: id },
      attributes: ["PRICE"],
      order: [["_id", "ASC"], [Sale, "PRICE", "ASC"]]
    },
    { transaction: transaction }
  );
};

const addOrderMenuBySaleWithTransaction = async (order, menu, count, sales, options, transaction) => {
  var sum = 0;
  for (var i in sales.sales) {
    const sale = sales.sales[i];

    if (sale.LIMIT === -1) return sum + (await addOrderMenuWithTransaction(order, menu, count, sale.PRICE, options, transaction));

    if (sale.COUNT > count) {
      await saleMenuWithTransaction(sale._id, sale.COUNT - count, transaction);
      return sum + (await addOrderMenuWithTransaction(order, menu, count, sale.PRICE, options, transaction));
    }

    await saleMenuWithTransaction(sale._id, 0, transaction);
    sum += await addOrderMenuWithTransaction(order, menu, sale.COUNT, sale.PRICE, options, transaction);
    count -= sale.COUNT;
  }

  return sum + (await addOrderMenuWithTransaction(order, menu, count, sales.PRICE, options, transaction));
};

const saleMenuWithTransaction = async (id, count, transaction) => {
  return Sale.update({ COUNT: count }, { where: { _id: id }, transaction: transaction });
};

const addOrderMenuWithTransaction = async (order, menu, count, price, options, transaction) => {
  const om = await OrderMenu.create({ ORDERID: order, MENUID: menu, COUNT: count, PRICE: price }, { transaction: transaction });
  var sum = price;
  for (var i in options) {
    if (options[i]) {
      const omo = await OrderMenuOption.create({ ORDERMENUID: om._id, OPTIONID: parseInt(i) }, { transaction: transaction });
      const option = await OrderMenuOption.findOne({
        include: [
          {
            model: ShopMenuOptions,
            include: [
              {
                model: ShopOptions,
                attributes: ["PRICE"],
                required: false
              }
            ],
            required: false
          }
        ],
        where: { _id: omo._id },
        transaction: transaction
      });

      sum += option.shop_menu_option.shop_option.PRICE;
    }
  }
  return sum * count;
};

exports.doOrder = async (req, res, next) => {
  const shop = req.params.id;
  const user = req.info._id;
  const cart = req.body.cart;
  const address = req.body.address;
  const require = req.body.require;
  const phone = req.body.phone;

  return models.sequelize.transaction(async t => {
    try {
      const order = await Order.create({ SHOPID: shop, USERID: user, ADDRESS: address, REQUIRE: require, PHONE: phone }, { transaction: t });

      var sum = 0;
      for (var i in cart) {
        const item = cart[i];

        const sales = await getShopMenuWithSaleWithTransaction(item.id, t);

        sum += await addOrderMenuBySaleWithTransaction(order._id, item.id, item.count, sales, item.options, t);
      }

      await Order.update({ PRICE: sum, ADMISSION: null }, { where: { _id: order._id }, transaction: t });
      await OrderPush.create({ ORDERID: order._id, SHOPID: shop }, { transaction: t });

      return res.json({ success: 0, price: sum });
    } catch (exception) {
      console.log(exception);
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};

const shopLatlngUpdate = async (user, shop, lat, lng) => {
  const s = await ShopAddress.findOne({ where: { SHOPID: shop } });
  if (!s || s.ADMIN) return false;

  const exist = await ShopTempLatlng.findOne({ where: { USERID: user, SHOPID: shop } });
  if (exist) return false;

  await ShopTempLatlng.create({
    SHOPID: shop,
    USERID: user,
    ADDRLAT: lat,
    ADDRLNG: lng
  });

  const count = await ShopTempLatlng.count({ where: { SHOPID: shop, ADDRLAT: lat, ADDRLNG: lng } });
  if (count >= LatLngUpdateCount) {
    const s = await ShopAddress.findAll({ where: { SHOPID: shop } });
    const scount = await ShopTempLatlng.count({ where: { SHOPID: shop, ADDRLAT: s.ADDRLAT, ADDRLNG: s.ADDRLNG } });

    if (count > scount) ShopAddress.update({ ADDRLAT: lat, ADDRLNG: lng }, { where: { SHOPID: shop } });
  }

  return true;
};

exports.setLatlng = async (req, res, next) => {
  if (!req.info) return res.status(500).json({ success: 1 });

  const lat = req.body.lat;
  const lng = req.body.lng;
  const user = req.info._id;
  const shop = req.params.id;

  if (!lat) return res.status(412).json({ success: -1 });
  if (!lng) return res.status(412).json({ success: -2 });
  if (!user) return res.status(412).json({ success: -3 });
  if (!shop) return res.status(412).json({ success: -4 });
  if (!/^[\d]*\.[\d]*$/.test(lat)) return res.status(412).json({ success: -1 });
  if (!/^[\d]*\.[\d]*$/.test(lng)) return res.status(412).json({ success: -2 });
  if (!/^[\d]*$/.test(user)) return res.status(412).json({ success: -3 });
  if (!/^[\d]*$/.test(shop)) return res.status(412).json({ success: -4 });

  await shopLatlngUpdate(user, shop, lat, lng);

  return res.json({ success: 0 });
};

/**
 * Methods
 */
exports.getShopById = async id => {
  return Shop.findOne({ where: { _id: id } });
};
