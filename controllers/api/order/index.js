const models = require("@models");

const Order = require("@models").order;
const OrderPush = require("@models").order_push;
const OrderMenu = require("@models").order_menu;
const OrderMenuOption = require("@models").order_menu_option;

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
      attributes: ["_id", "COUNT", "PRICE", "MENUID"],
      include: [
        {
          model: OrderMenuOption,
          attributes: ["_id"],
          include: [
            {
              model: ShopMenuOptions,
              attributes: ["_id"],
              include: [{ model: ShopOptions, attributes: ["OPTIONNAME", "PRICE"] }]
            }
          ]
        },
        { model: ShopMenu, attributes: ["MENUNAME"] }
      ]
    }
  ];

  if (owner !== -1) include.push({ model: Shop, where: { OWNERID: owner } });
  else include.push({ model: Shop });

  const options = {
    include: include,
    attributes: ["ADDRESS", "ADMISSION", "PHONE", "PRICE", "REQUIRE", "SHOPID", "_id", "USERID", "createdAt"],
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

  return Order.update({ ADMISSION: true }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};

exports.refuseOrder = async (req, res, next) => {
  const owner = req.info._id;
  const id = req.params.order;

  const order = await Order.findOne({ where: { _id: id } });
  const permission = await checkPermissionShop(owner, order.SHOPID);
  if (!permission) return res.status(403).json({ success: 1 });

  return Order.update({ ADMISSION: false }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
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
                include: [{ model: ShopOptions, attributes: ["OPTIONNAME", "PRICE"] }]
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
