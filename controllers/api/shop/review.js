const models = require("@models");

const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;
const ShopOptions = require("@models").shop_options;
const ShopMenuOptions = require("@models").shop_menu_options;

const Order = require("@models").order;
const OrderMenu = require("@models").order_menu;
const OrderMenuOption = require("@models").order_menu_option;

const User = require("@models").user;

const Review = require("@models").review;
const ReviewPhoto = require("@models").review_photo;

const Op = require("sequelize").Op;
const Fn = require("sequelize").fn;
const Col = require("sequelize").col;

const Files = require("@controllers/files");

const ShowCount = 10;

exports.getReviews = async (req, res, next) => {
  const shop = req.params.id;
  const page = req.params.page;

  return Review.findAll({
    include: [
      { model: User, attributes: ["USERNAME"] },
      { model: ReviewPhoto, required: false },
      {
        model: Order,
        attributes: ["_id"],
        include: [
          {
            model: OrderMenu,
            attributes: ["_id", "COUNT", "MENUID"],
            include: [
              {
                model: OrderMenuOption,
                attributes: ["_id"],
                include: [{ model: ShopMenuOptions, attributes: ["_id"], include: [{ model: ShopOptions, attributes: ["_id", "OPTIONNAME"] }] }]
              },
              { model: ShopMenu, attributes: ["MENUNAME"] }
            ]
          }
        ]
      }
    ],
    where: { SHOPID: shop },
    offset: (page - 1) * ShowCount,
    limit: ShowCount,
    order: [["createdAt", "DESC"]]
  })
    .then(reviews => res.json({ success: 0, reviews: reviews }))
    .catch(err => res.status(500).json({ success: -1 }));
};

exports.writeReview = async (req, res, next) => {
  const files = req.files;
  const text = req.body.text;
  const point = req.body.point;
  const order = req.params.order;
  const shop = req.params.id;
  const id = req.info._id;

  if (text === "") return res.status(412).json({ success: -1 });
  if (point < 0 || point > 5) return res.status(412).json({ success: -2 });

  const writable = await Order.findOne({ where: { _id: order, SHOPID: shop, USERID: id } });
  if (!writable) return res.status(403).json({ success: -3 });

  const exist = await Review.findOne({ where: { SHOPID: shop, USERID: id, ORDERID: order } });
  if (exist) return res.status(409).json({ success: -4 });

  let newFiles = [];

  return models.sequelize.transaction(async t => {
    try {
      const review = await Review.create({ SHOPID: shop, USERID: id, ORDERID: order, POINT: point, TEXT: text }, { transaction: t });

      for (var i in files) {
        const file = files[i];
        const original = file.originalname.split(".");
        const ext = original[original.length - 1].toLowerCase();

        const URL = await Files.saveFileFromTempAsRandomName(file.filename, "." + ext, "Review");
        newFiles.push(URL);
        await ReviewPhoto.create({ REVIEWID: review._id, URL: URL }, { transaction: t });
      }

      const newPoint = await Review.findOne({ attributes: [[Fn("AVG", Col("POINT")), "AVG"]], group: ["SHOPID"], where: { SHOPID: shop }, transaction: t });

      await Shop.update({ POINT: newPoint.dataValues.AVG }, { where: { _id: shop }, transaction: t });

      return res.json({ success: 0 });
    } catch (exception) {
      console.log(exception);
      for (var i in newFiles) await Files.removeReviewFile(newFiles[i]);
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};
