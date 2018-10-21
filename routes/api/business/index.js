const express = require("express");
const router = express.Router();

const Business = require("@api/business");
const Auth = require("@controllers/auth");
const Files = require("@controllers/files");

router.get("/", Auth.Owner.requireOwner, Business.getShopList);
router.get("/request/:page", Auth.Admin.requireAdmin, Business.getRegisterBusiness);

router.post("/", Auth.Owner.requireOwner, Business.registerBusiness);
router.post("/photo", Auth.Owner.requireOwner, Files.uploadPhoto.array("photo"), Business.uploadPhoto);

router.put("/request/admission/:id", Auth.Admin.requireAdmin, Business.admissionBusiness);

module.exports = router;
