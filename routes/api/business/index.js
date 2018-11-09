const express = require("express");
const router = express.Router();

const Business = require("@api/business");
const Shop = require("@api/shop");
const Auth = require("@controllers/auth");
const Files = require("@controllers/files");

router.get("/", Auth.Owner.requireOwner, Business.getShopList);
router.get("/request/:page", Auth.Admin.requireAdmin, Business.getRegisterBusiness);
router.get("/shop/:page([0-9]*)/:keyword(*)", Auth.Owner.requireOwner, Business.searchBusinessShops);

router.post("/", Auth.Owner.requireOwner, Business.registerBusiness);
router.post("/shop", Auth.Owner.requireOwner, Shop.registerBusinessShop);
router.post("/photo", Auth.Owner.requireOwner, Files.uploadPhoto.array("photo"), Business.uploadPhoto);

router.put("/request/admission/:id", Auth.Admin.requireAdmin, Business.admissionBusiness);

module.exports = router;
