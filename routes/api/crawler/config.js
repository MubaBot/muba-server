const express = require("express");
const router = express.Router();

const Config = require("@api/crawler/config");
const Auth = require("@controllers/auth");

router.get("/search", Auth.Admin.requireAdmin, Config.getSearchConfigList);

router.post("/search", Auth.Admin.requireAdmin, Config.insertSearchConfig);
router.post("/search/:id", Auth.Admin.requireAdmin, Config.appendSearchMode);

router.delete("/search/:id", Auth.Admin.requireAdmin, Config.removeSearchConfig);
router.delete("/search/:id/:mode", Auth.Admin.requireAdmin, Config.removeMode);

router.get("/content", Auth.Admin.requireAdmin, Config.getContentConfigList);

router.post("/content", Auth.Admin.requireAdmin, Config.insertContentConfig);
router.put("/content/:domain", Auth.Admin.requireAdmin, Config.updateContentConfig);

router.delete("/content/:id", Auth.Admin.requireAdmin, Config.removeContentConfig);

module.exports = router;
