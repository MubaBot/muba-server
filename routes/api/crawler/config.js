const express = require("express");
const router = express.Router();

const Config = require("@api/crawler/config");
const Auth = require("@controllers/auth");

router.get("/search", Auth.requireAdmin, Config.getSearchConfigList);

router.post("/search", Auth.requireAdmin, Config.insertSearchConfig);
router.post("/search/:id", Auth.requireAdmin, Config.appendSearchMode);

router.delete("/search/:id", Auth.requireAdmin, Config.removeSearchConfig);
router.delete("/search/:id/:mode", Auth.requireAdmin, Config.removeMode);

router.get("/content", Auth.requireAdmin, Config.getContentConfigList);

router.post("/content", Auth.requireAdmin, Config.insertContentConfig);
router.put("/content/:domain", Auth.requireAdmin, Config.updateContentConfig);

router.delete("/content/:id", Auth.requireAdmin, Config.removeContentConfig);

module.exports = router;
