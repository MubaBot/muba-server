const models = require("@models");

const Order = require("@models").order;
const OrderPush = require("@models").order_push;
const OrderMenu = require("@models").order_menu;
const OrderMenuOption = require("@models").order_menu_option;
const OrderRefuseMessage = require("@models").order_refuse_message;

const Sale = require("@models").sale;
const User = require("@models").user;
const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;
const ShopOptions = require("@models").shop_options;
const ShopMenuOptions = require("@models").shop_menu_options;

const moment = require("moment");
const Op = require("sequelize").Op;

const ShowCount = 10;

const getOrderItems = async (owner = -1, page, { where }) => {
  let include = [
    { model: User, attributes: ["USERNAME"] },
    {
      model: OrderMenu,
      attributes: ["_id", "COUNT", "PRICE", "MENUID", "SALEID"],
      include: [
        {
          model: OrderMenuOption,
          attributes: ["_id"],
          include: [
            {
              model: ShopMenuOptions,
              attributes: ["_id"],
              include: [{ model: ShopOptions, attributes: ["_id", "OPTIONNAME", "PRICE"] }]
            }
          ]
        },
        { model: ShopMenu, attributes: ["MENUNAME"] }
      ]
    },
    { model: OrderRefuseMessage, require: false }
  ];

  if (owner !== -1) include.push({ model: Shop, where: { OWNERID: owner } });
  else include.push({ model: Shop });

  const options = {
    include: include,
    attributes: ["ADDRESS", "ADMISSION", "PHONE", "PRICE", "REQUIRE", "SHOPID", "VISIT", "_id", "USERID", "createdAt", "ADMISSIONID"],
    where: where,
    offset: (page - 1) * ShowCount,
    limit: ShowCount,
    order: [["createdAt", "DESC"]]
  };

  return Order.findAll(options);
};

exports.getOrderListForOwner = async (req, res, next) => {
  const shop = req.params.id;
  const page = req.params.page;
  const id = req.info._id;

  const requests = await getOrderItems(id, page, { where: { SHOPID: shop } });

  const count = await Order.count({
    include: [{ model: Shop, where: { OWNERID: id } }]
  });

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: requests });
};

exports.getOrderListForOwnerByAdmission = async (req, res, next) => {
  const shop = req.params.id;
  const page = req.params.page;
  const id = req.info._id;

  const requests = await getOrderItems(id, page, { where: { ADMISSION: true, SHOPID: shop } });

  const count = await Order.count({
    include: [{ model: Shop, where: { OWNERID: id } }],
    where: { ADMISSION: true }
  });

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: requests });
};

exports.getOrderListForUser = async (req, res, next) => {
  const page = req.params.page;
  const id = req.info._id;

  const requests = await getOrderItems(-1, page, { where: { USERID: id } });

  return res.json({ success: 0, lists: requests });
};

const checkPermissionShop = async (owner, shop) => {
  return !!(await Shop.findOne({ where: { OWNERID: owner, _id: shop } }));
};

exports.allowOrder = async (req, res, next) => {
  const owner = req.info._id;
  const id = req.params.order;

  const order = await Order.findOne({ where: { _id: id } });
  const permission = await checkPermissionShop(owner, order.SHOPID);
  if (!permission) return res.status(403).json({ success: 1 });

  return Order.update({ ADMISSION: 1 }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};

exports.refuseOrder = async (req, res, next) => {
  const owner = req.info._id;
  const id = req.params.order;
  const admission = req.params.admission;

  const orders = await getOrderItems(owner, 1, { where: { _id: id } });
  if (orders.length === 0) return res.status(403).json({ success: 1 });

  const permission = await checkPermissionShop(owner, orders[0].SHOPID);
  if (!permission) return res.status(403).json({ success: 1 });

  return models.sequelize.transaction(async t => {
    try {
      const menus = orders[0].order_menus;
      for (var i in menus) await resetSaleCountWithTransaction(menus[i], t);
      await Order.update({ ADMISSION: 0, ADMISSIONID: admission }, { where: { _id: id }, transaction: t });
      await OrderPush.destroy({ where: { ORDERID: id }, transaction: t });

      // reset sale

      return res.json({ success: 0 });
    } catch (exception) {
      console.log(exception);
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};

exports.getPushItemForShop = async (req, res, next) => {
  const shop = req.params.id;

  const push = await OrderPush.findOne({
    where: {
      SHOPID: shop,
      createdAt: {
        [Op.lte]: moment
          .utc()
          .subtract(10, "seconds")
          .toDate()
      }
    }
  });
  if (push)
    return OrderPush.destroy({ where: { _id: push._id } })
      .then(() => res.json({ success: 0, id: push.ORDERID }))
      .catch(() => res.status(500).json({ success: -1 }));

  return res.json({ success: 0, id: -1 });
};

exports.getOrderItemInfo = async (req, res, next) => {
  const owner = req.info._id;
  const order = req.params.order;
  const shop = req.params.id;

  return Order.findOne({
    include: [
      { model: User, attributes: ["USERNAME"] },
      { model: Shop, where: { OWNERID: owner } },
      {
        model: OrderMenu,
        attributes: ["_id", "COUNT", "PRICE", "MENUID"],
        include: [
          {
            model: OrderMenuOption,
            attributes: ["_id"],
            include: [
              {
                model: ShopMenuOptions,
                attributes: ["_id"],
                include: [{ model: ShopOptions, attributes: ["_id", "OPTIONNAME", "PRICE"] }]
              }
            ]
          },
          { model: ShopMenu, attributes: ["MENUNAME"] }
        ]
      }
    ],
    attributes: ["ADDRESS", "ADMISSION", "PHONE", "PRICE", "REQUIRE", "SHOPID", "_id", "USERID", "createdAt"],
    where: { _id: order, SHOPID: shop },
    order: [["createdAt", "DESC"]]
  })
    .then(result => res.json(result))
    .catch(() => res.status(500).json({ success: -1 }));
};

exports.cancelOrder = async (req, res, next) => {
  const user = req.info._id;
  const id = req.params.order;

  const orders = await getOrderItems(-1, 1, { where: { _id: id } });
  if (orders.length === 0) return res.status(403).json({ success: 1 });

  return models.sequelize.transaction(async t => {
    try {
      const menus = orders[0].order_menus;
      for (var i in menus) await resetSaleCountWithTransaction(menus[i], t);

      await Order.update({ ADMISSION: 2 }, { where: { _id: id }, transaction: t });
      await OrderPush.destroy({ where: { ORDERID: id }, transaction: t });

      return res.json({ success: 0 });
    } catch (exception) {
      console.log(exception);
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};

exports.getRefuseMessage = async (req, res, next) => {
  const shop = req.params.id;

  return OrderRefuseMessage.findAll({ where: { SHOPID: shop } })
    .then(messages => res.json({ success: 0, lists: messages }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.addRefuseMessage = async (req, res, next) => {
  const shop = req.params.id;
  const name = req.body.name;
  const message = req.body.message;

  if (!name) return res.status(412).json({ success: -2 });
  if (!message) return res.status(412).json({ success: -3 });

  const exist = await OrderRefuseMessage.findOne({ where: { SHOPID: shop, NAME: name } });
  if (exist) return res.status(409).json({ success: -4 });

  return OrderRefuseMessage.create({ SHOPID: shop, NAME: name, MESSAGE: message })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.modifyOrderRefuseMessage = async (req, res, next) => {
  const shop = req.params.id;
  const refuse = req.params.refuse;
  const name = req.body.name;
  const message = req.body.message;

  if (!name) return res.status(412).json({ success: -2 });
  if (!message) return res.status(412).json({ success: -3 });

  const r = await OrderRefuseMessage.findOne({ where: { _id: refuse, SHOPID: shop } });
  if (!r) return res.status(409).json({ success: -4 });

  const exist = await OrderRefuseMessage.findOne({ where: { SHOPID: shop, NAME: name, _id: { [Op.not]: refuse } } });
  if (exist) return res.status(409).json({ success: -4 });

  return OrderRefuseMessage.update({ NAME: name, MESSAGE: message }, { where: { _id: refuse } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};

const resetSaleCountWithTransaction = async (menu, transaction) => {
  try {
    if (menu.SALEID === null) return true;

    const sale = await Sale.findOne({ where: { _id: menu.SALEID }, transaction: transaction });
    if (!sale) return false;

    await Sale.update({ COUNT: sale.COUNT + menu.COUNT }, { where: { _id: menu.SALEID }, transaction: transaction });
    return true;
  } catch (err) {
    return Promise.reject(err);
  }
};
