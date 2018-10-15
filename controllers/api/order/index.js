const models = require("@models");

const Order = require("@models").order;
const OrderMenu = require("@models").order_menu;
const OrderMenuOption = require("@models").order_menu_option;

const User = require("@models").user;
const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;
const ShopOptions = require("@models").shop_options;
const ShopMenuOptions = require("@models").shop_menu_options;

const ShowCount = 10;

exports.getOrderListForOwner = async (req, res, next) => {
  const page = req.params.page;
  const id = req.info._id;

  const requests = await Order.findAll({
    include: [
      {
        model: User,
        attributes: ["USERNAME"]
      },
      {
        model: Shop,
        where: { OWNERID: id }
      },
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
                include: [
                  {
                    model: ShopOptions,
                    attributes: ["OPTIONNAME", "PRICE"]
                  }
                ]
              }
            ]
          },
          {
            model: ShopMenu,
            attributes: ["MENUNAME"]
          }
        ]
      }
    ],
    attributes: ["ADDRESS", "ADMISSION", "PHONE", "PRICE", "REQUIRE", "SHOPID", "_id", "USERID", "createdAt"],
    offset: (page - 1) * ShowCount,
    limit: ShowCount,
    order: [["createdAt", "DESC"]]
  });

  const count = await Order.count({
    include: [
      {
        model: Shop,
        where: { OWNERID: id }
      }
    ]
  });

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: requests });
};

exports.getOrderListForOwnerByAdmission = async (req, res, next) => {
  const page = req.params.page;
  const id = req.info._id;

  const requests = await Order.findAll({
    include: [
      {
        model: User,
        attributes: ["USERNAME"]
      },
      {
        model: Shop,
        where: { OWNERID: id }
      },
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
                include: [
                  {
                    model: ShopOptions,
                    attributes: ["OPTIONNAME", "PRICE"]
                  }
                ]
              }
            ]
          },
          {
            model: ShopMenu,
            attributes: ["MENUNAME"]
          }
        ]
      }
    ],
    where: { ADMISSION: true },
    attributes: ["ADDRESS", "ADMISSION", "PHONE", "PRICE", "REQUIRE", "SHOPID", "_id", "USERID", "createdAt"],
    offset: (page - 1) * ShowCount,
    limit: ShowCount,
    order: [["createdAt", "DESC"]]
  });

  const count = await Order.count({
    include: [
      {
        model: Shop,
        where: { OWNERID: id }
      }
    ],
    where: { ADMISSION: true }
  });

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: requests });
};

exports.getOrderListForUser = async (req, res, next) => {
  const page = req.params.page;
  const id = req.info._id;

  const requests = await Order.findAll({
    include: [
      {
        model: User,
        attributes: ["USERNAME"]
      },
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
                include: [
                  {
                    model: ShopOptions,
                    attributes: ["OPTIONNAME", "PRICE"]
                  }
                ]
              }
            ]
          },
          {
            model: ShopMenu,
            attributes: ["MENUNAME"]
          }
        ]
      }
    ],
    where: { USERID: id },
    attributes: ["ADDRESS", "ADMISSION", "PHONE", "PRICE", "REQUIRE", "SHOPID", "_id", "USERID", "createdAt"],
    offset: (page - 1) * ShowCount,
    limit: ShowCount,
    order: [["createdAt", "DESC"]]
  });

  console.log(JSON.stringify(requests[0]));

  return res.json({ success: 0, lists: requests });
};

const checkPermissionShop = async (owner, shop) => {
  return !!(await Shop.findOne({ where: { OWNERID: owner, _id: shop } }));
};

exports.allowOrder = async (req, res, next) => {
  const owner = req.info._id;
  const id = req.params.id;

  const order = await Order.findOne({ where: { _id: id } });
  const permission = await checkPermissionShop(owner, order.SHOPID);
  if (!permission) return res.status(403).json({ success: 1 });

  return Order.update({ ADMISSION: true }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};

exports.refuseOrder = async (req, res, next) => {
  const owner = req.info._id;
  const id = req.params.id;

  const order = await Order.findOne({ where: { _id: id } });
  const permission = await checkPermissionShop(owner, order.SHOPID);
  if (!permission) return res.status(403).json({ success: 1 });

  return Order.update({ ADMISSION: false }, { where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(() => res.status(500).json({ success: 1 }));
};
