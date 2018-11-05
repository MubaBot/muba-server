const path = require("path");
const ShopApi = require("@api/shop");
const Files = require("@controllers/files");

const models = require("@models");
const BusinessCertificationRequestLog = require("@models").business_certification_request_log;
const BusinessCertificationRequest = require("@models").business_certification_request;
const BusinessCertification = require("@models").business_certification;

const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;
const ShopAddress = require("@models").shop_address;

const ShowCount = 10;

exports.getShopList = async (req, res, next) => {
  const id = req.info._id;
  const shops = await Shop.findAll({
    include: [{ model: ShopAddress }, { model: ShopMenu }],
    where: { OWNERID: id }
  });

  return res.json({ success: 0, lists: shops });
};

exports.getRegisterBusiness = async (req, res, next) => {
  const page = req.params.page;

  const requests = await BusinessCertificationRequest.findAll({
    include: [
      {
        model: Shop,
        attributes: ["SHOPNAME"],
        include: [
          {
            model: ShopAddress
          }
        ]
      }
    ],
    offset: (page - 1) * ShowCount,
    limit: ShowCount
  });

  const count = await BusinessCertificationRequest.count({});

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: requests });
};

exports.uploadPhoto = async (req, res, next) => {
  const file = req.files[0];
  if (!file) return res.status(412).json({ success: -1 });

  const name = file.filename;
  const ext = path.extname(file.originalname);

  // if (!/^(png|jpg|jpeg|gif)$/.test(ext)) If file format doesn't match then remove file.

  return res.json({ success: 0, name: name, ext: ext });
};

exports.registerBusiness = async (req, res, next) => {
  const file = req.body.file;
  const ext = req.body.ext;
  const shop = req.body.shop;
  const shop_id = req.body.shop_id;
  const name = req.body.name;
  const number = req.body.number;
  const owner = req.info._id;

  const s = await ShopApi.getShopById(shop_id);

  if (!s || s.SHOPNAME !== shop) return res.status(412).json({ success: -1 });

  const p = await Files.saveFileFromTempAsRandomName(file, ext, "Business");
  if (p === false) return res.status(500).json({ success: -1 });

  return models.sequelize.transaction(async t => {
    try {
      await BusinessCertificationRequest.create({ SHOPID: shop_id, NUMBER: number, USERNAME: name, URL: p, OWNERID: owner });
      await BusinessCertificationRequestLog.create({ SHOPID: shop_id, NUMBER: number, USERNAME: name, URL: p, OWNERID: owner });

      return res.json({ success: 0 });
    } catch (exception) {
      t.rollback();
      console.log(exception);
      Files.resetBusinessFile(p, file);
      return res.status(500).json({ success: 1 });
    }
  });
};

exports.admissionBusiness = async (req, res, next) => {
  const id = req.params.id;

  const request = await BusinessCertificationRequest.findOne({ where: { _id: id } });
  if (!request) return res.status(404).json({ success: -1 });

  return models.sequelize.transaction(async t => {
    try {
      await BusinessCertification.destroy({ where: { SHOPID: request.SHOPID } }, { transaction: t });
      await BusinessCertification.create(
        { SHOPID: request.SHOPID, OWNERID: request.OWNERID, NUMBER: request.NUMBER, USERNAME: request.USERNAME, URL: request.URL },
        { transaction: t }
      );
      await Shop.update({ OWNERID: request.OWNERID }, { where: { _id: request.SHOPID }, transaction: t });
      await BusinessCertificationRequest.destroy({ where: { SHOPID: request.SHOPID } }, { transaction: t });

      return res.json({ success: 0 });
    } catch (exception) {
      t.rollback();
      return res.status(500).json({ success: 1 });
    }
  });
};
