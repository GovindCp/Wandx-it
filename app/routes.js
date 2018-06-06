const express = require("express"),
    AssetController = require("../app/controller/assetController");

const router = express.Router();
router.post("/asset/create",AssetController.createAsset);
router.get("/asset/get", AssetController.getAssetDetails);
router.get("/asset/list",AssetController.getAssetsList);


module.exports = router; 

