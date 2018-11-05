const express = require("express");
const router = express.Router();

const Shop = require("@api/shop");
const Order = require("@api/order");
const Auth = require("@controllers/auth");
const Files = require("@controllers/files");

/**
 * Info
 */
router.get("/:id/owner", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.getShopOwnerCount);
router.get("/:id", Shop.getShopInfo);
router.get("/list/:page([0-9]*)/:lat/:lng/:keyword(*)", Auth.isLogin, Shop.searchShops);
router.get("/list/sale/:page([0-9]*)/:lat/:lng/:time([0-9]*)", Auth.isLogin, Shop.Sale.searchSaleShops);

router.post("/", Auth.Admin.requireAdmin, Shop.createShops);

router.put("/:id", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.updateShopInfo);
router.put("/:id/latlng", Auth.getLoginInfo, Shop.setLatlng);

/**
 * Menu
 */
router.get("/:id/menu/:menu/sale", Shop.getShopSaleInfo);
router.get("/:id/menu/:menu/option", Shop.getShopOptionInfo);

router.post("/:id/menu", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.addShopMenu);
router.post("/:id/menu/:menu/sale", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.addShopMenuSale);

router.put("/:id/menu/:menu", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.modifyShopMenu);
router.put("/:id/menu/:menu/sale/:sale", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.modifyShopMenuSale);
router.put("/:id/menu/:menu/photo", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Files.uploadPhoto.array("photo"), Shop.updateMenuPhoto);

router.delete("/:id/menu/:menu", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.deleteShopMenu);
router.delete("/:id/menu/:menu/sale/:sale", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.deleteShopMenuSale);

/**
 * Options
 */
router.post("/:id/option", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.addShopOption);

router.put("/:id/option/:option", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.modifyShopOption);

router.delete("/:id/option/:option", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Shop.deleteShopOption);

/**
 * Order
 */
router.get("/:id/order/push", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Order.getPushItemForShop);
router.get("/:id/order/:page", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Order.getOrderListForOwner);
router.get("/:id/order/:order/info", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Order.getOrderItemInfo);
router.get("/:id/order/admission/:page", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Order.getOrderListForOwnerByAdmission);

router.put("/:id/order/:order/allow", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Order.allowOrder);
router.put("/:id/order/:order/refuse", Auth.Owner.requireOwner, Auth.Owner.shopAuthCheck, Order.refuseOrder);

router.post("/:id/order", Auth.requireUser, Shop.doOrder);

module.exports = router;

module.exports = router;
