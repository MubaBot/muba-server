const path = require("path");
const moment = require("moment");

const ShopApi = require("@api/shop");
const Files = require("@controllers/files");

const models = require("@models");
const BusinessCertificationRequestLog = require("@models").business_certification_request_log;
const BusinessCertificationRequest = require("@models").business_certification_request;
const BusinessCertification = require("@models").business_certification;

const Owner = require("@models").owner;

const Shop = require("@models").shop;
const ShopMenu = require("@models").shop_menu;

const Op = require("sequelize").Op;
const Fn = require("sequelize").fn;
const Col = require("sequelize").col;

const ShowCount = 10;

exports.searchBusinessShops = async (req, res, next) => {
  const keyword = req.params.keyword;
  const page = req.params.page;

  const shops = await Shop.findAll({
    include: [
      {
        model: ShopMenu,
        attributes: ["_id"],
        required: false
      }
    ],
    where: { SHOPNAME: { [Op.like]: `%${keyword}%` } },
    offset: (page - 1) * ShowCount,
    limit: ShowCount,
    order: [[Fn("isnull", Col("OWNERID")), "DESC"]]
  }).catch(err => {
    console.log(err);
    return [];
  });

  return res.json({ success: 0, lists: shops });
};

const getBusinessShopsForAdmin = async (page, where = {}, mode = null) => {
  return Shop.findAll({
    include: [
      {
        model: ShopMenu,
        attributes: ["_id"]
      },
      {
        model: Owner,
        attributes: ["USERNAME", "ID"],
        where: mode === "owner" ? where : {},
        required: mode === "owner" ? true : false
      }
    ],
    where: mode === null ? where : {},
    offset: (page - 1) * ShowCount,
    limit: ShowCount,
    order: [[Fn("isnull", Col("OWNERID")), "ASC"], ["_id", "DESC"]]
  });
};

const getBusinessShopsCountForAdmin = async (where = {}, mode = null) => {
  return Shop.count({
    include: [
      {
        model: Owner,
        attributes: ["USERNAME", "ID"],
        where: mode === "owner" ? where : {},
        required: mode === "owner" ? true : false
      }
    ],
    where: mode === null ? where : {}
  });
};

exports.searchBusinessShopsByAddressForAdmin = async (req, res, next) => {
  const page = req.params.page;

  const where = { ADDRLAT: 0, ADDRLNG: 0 };

  const shops = await getBusinessShopsForAdmin(page, where);
  const count = await getBusinessShopsCountForAdmin(where);

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: shops });
};

exports.searchBusinessShopsByNameForAdmin = async (req, res, next) => {
  const page = req.params.page;
  const name = req.params.name;

  const where = { SHOPNAME: { [Op.like]: `%${name}%` } };

  const shops = await getBusinessShopsForAdmin(page, where);
  const count = await getBusinessShopsCountForAdmin(where);

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: shops });
};

exports.searchBusinessShopsByOwnerForAdmin = async (req, res, next) => {
  const page = req.params.page;
  const owner = req.params.owner;

  const where = { ID: { [Op.like]: `%${owner}%` } };

  const shops = await getBusinessShopsForAdmin(page, where, "owner");
  const count = await getBusinessShopsCountForAdmin(where, "owner");

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: shops });
};

exports.getShopList = async (req, res, next) => {
  const id = req.info._id;
  const shops = await Shop.findAll({
    include: [{ model: ShopMenu }],
    where: { OWNERID: id }
  });

  return res.json({ success: 0, lists: shops });
};

exports.getRegisterBusiness = async (req, res, next) => {
  const page = req.params.page;

  const requests = await BusinessCertificationRequest.findAll({
    include: [{ model: Shop }],
    offset: (page - 1) * ShowCount,
    limit: ShowCount
  });

  const count = await BusinessCertificationRequest.count({});

  return res.json({ success: 0, count: count, displayCount: ShowCount, lists: requests });
};

exports.getRegisterBusinessLog = async (req, res, next) => {
  const page = req.params.page;

  const requests = await BusinessCertificationRequestLog.findAll({
    include: [{ model: Shop }],
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
      await BusinessCertificationRequest.create({ SHOPID: shop_id, NUMBER: number, USERNAME: name, URL: p, OWNERID: owner }, { transaction: t });
      await BusinessCertificationRequestLog.create({ SHOPID: shop_id, NUMBER: number, USERNAME: name, URL: p, OWNERID: owner }, { transaction: t });

      return res.json({ success: 0 });
    } catch (exception) {
      t.rollback();
      await Files.resetBusinessFile(p, file);
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

exports.deleteShopByAdmin = async (req, res, next) => {
  const id = req.params.id;

  return Shop.destroy({ where: { _id: id } })
    .then(() => res.json({ success: 0 }))
    .catch(err => res.status(500).json({ success: -1 }));
};
