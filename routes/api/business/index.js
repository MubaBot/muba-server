const express = require("express");
const router = express.Router();

const Business = require("@api/business");
const Auth = require("@controllers/auth");
const Files = require("@controllers/files");

router.get("/", Auth.requireOwner, Business.getShopList);
router.get("/request/:page", Auth.requireAdmin, Business.getRegisterBusiness);

router.post("/", Auth.requireOwner, Business.registerBusiness);
router.post("/photo", Auth.requireOwner, Files.uploadPhoto.array("photo"), Business.uploadPhoto);

router.put("/request/admission/:id", Auth.requireAdmin, Business.admissionBusiness);

module.exports = router;
