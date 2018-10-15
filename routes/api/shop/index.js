const express = require("express");
const router = express.Router();

const Shop = require("@api/shop");
const Auth = require("@controllers/auth");

router.get("/:id", Shop.getShopInfo);
router.get("/:id/menu/:menu/sale", Shop.getShopSaleInfo);
router.get("/:id/menu/:menu/option", Shop.getShopOptionInfo);
router.get("/list/:page/:keyword(*)", Auth.isLogin, Shop.searchShops);

router.post("/", Auth.requireAdmin, Shop.createShops);
router.post("/:id/menu", Auth.requireOwner, Auth.shopAuthCheck, Shop.addShopMenu);
router.post("/:id/menu/:menu/sale", Auth.requireOwner, Auth.shopAuthCheck, Shop.addShopMenuSale);
router.post("/:id/option", Auth.requireOwner, Auth.shopAuthCheck, Shop.addShopOption);
router.post("/:id/order", Auth.requireUser, Shop.doOrder);

router.put("/:id/latlng", Auth.getLoginInfo, Shop.setLatlng);
router.put("/:id/menu/:menu", Auth.requireOwner, Auth.shopAuthCheck, Shop.modifyShopMenu);
router.put("/:id/menu/:menu/sale/:sale", Auth.requireOwner, Auth.shopAuthCheck, Shop.modifyShopMenuSale);
router.put("/:id/option/:option", Auth.requireOwner, Auth.shopAuthCheck, Shop.modifyShopOption);

router.delete("/:id/menu/:menu", Auth.requireOwner, Auth.shopAuthCheck, Shop.deleteShopMenu);
router.delete("/:id/menu/:menu/sale/:sale", Auth.requireOwner, Auth.shopAuthCheck, Shop.deleteShopMenuSale);
router.delete("/:id/option/:option", Auth.requireOwner, Auth.shopAuthCheck, Shop.deleteShopOption);

module.exports = router;
