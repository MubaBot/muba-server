const express = require("express");
const router = express.Router();

const Business = require("@api/business");
const Chat = require("@api/chat");
const Shop = require("@api/shop");
const Auth = require("@controllers/auth");
const Files = require("@controllers/files");

router.get("/", Auth.Owner.requireOwner, Business.getShopList);
router.get("/request/:page(\\d+)", Auth.Admin.requireAdmin, Business.getRegisterBusiness);
router.get("/request/log/:page(\\d+)", Auth.Admin.requireAdmin, Business.getRegisterBusinessLog);
router.get("/shop/:page(\\d+)/address", Auth.Admin.requireAdmin, Business.searchBusinessShopsByAddressForAdmin);
router.get("/shop/:page(\\d+)/name/:name(*)", Auth.Admin.requireAdmin, Business.searchBusinessShopsByNameForAdmin);
router.get("/shop/:page(\\d+)/owner/:owner(*)", Auth.Admin.requireAdmin, Business.searchBusinessShopsByOwnerForAdmin);
router.get("/shop/:page(\\d+)/:keyword(*)", Auth.Owner.requireOwner, Business.searchBusinessShops);

router.post("/", Auth.Owner.requireOwner, Business.registerBusiness);
router.post("/shop", Auth.Owner.requireOwner, Shop.registerBusinessShop);
router.post("/photo", Auth.Owner.requireOwner, Files.uploadPhoto.array("photo"), Business.uploadPhoto);

router.put("/request/admission/:id", Auth.Admin.requireAdmin, Business.admissionBusiness);

router.put("/service/:request(\\d+)/allow", Auth.Admin.requireAdmin, Shop.Service.allowRequest);
router.put("/service/:request(\\d+)/refuse", Auth.Admin.requireAdmin, Shop.Service.refuseRequest);

router.delete("/shop/:id", Auth.Admin.requireAdmin, Business.deleteShopByAdmin);

/**
 * Chatbot
 */
router.post("/chatbot/:page(\\d+)", Auth.Admin.requireAdmin, Chat.updateChatbotData);

module.exports = router;
