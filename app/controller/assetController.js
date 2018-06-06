const mongoose = require('mongoose'),
  UserModel = require('../model/user'),
  AssetModel = require('../model/asset'),
  validator = require("../../validators/reqValidator"),
  validate = require("validate.js"),
  config = require("../../config/env");

// Create Asset
function createAsset(req, res) {
    // valdating request parameters
    validator.createAssetValidate(req.body).then((data) => {
        return UserModel.findOne({_id:req.currentUser._id,role:'Admin'});
    }).then((userData)=>{
        if(userData){
            var assetDet = new AssetModel({
                asset_name: req.body.asset_name,
                asset_tag: req.body.asset_tag,
                asset_serial_no: req.body.asset_serial_no,
                asset_brand: req.body.asset_brand,
                assets_description: req.body.assets_description,
                asset_purchased_price: req.body.asset_purchased_price,
                vendor_details: req.body.vendor_details,
                warranty_period: req.body.warranty_period
            });
            return assetDet.save();
        }else{
            throw "Permission denied."
        }
    }).then((saveDet) => {
        return res.status(200).send({success:true,data:saveDet});
    }).catch((err) => {
        return res.status(400).send({success:false,message: err });
    })
}

// Get Asset By Id
function getAssetDetails(req, res) {
    // valdating request parameters
    validator.getAssetDetailsValidate(req.query).then((data) => {
        return UserModel.findOne({_id:req.currentUser._id,role:'Admin'});
    }).then((userData)=>{
        if(userData){
            return AssetModel.findById({_id:req.query.assetId});
        }else{
            throw "Permission denied."
        }
    }).then((assetData) => {
        return res.status(200).send({success:true,data:assetData});
    }).catch((err) => {
        return res.status(400).send({success:false,message: err });
    })
}

// Get Assets List
function getAssetsList(req, res) {
    // valdating request parameters
    validator.getAssetsListValidate(req.query).then((data) => {
        return UserModel.findOne({_id:req.currentUser._id,role:'Admin'});
    }).then((userData)=>{
        if(userData){
            var filter = {};
            if(req.query.tag){
                filter.asset_tag = req.query.tag
            }
            if(req.query.brand){
                filter.asset_brand = req.query.brand
            }
            return AssetModel.find(filter);
        }else{
            throw "Permission denied."
        }
    }).then((assetData) => {
        return res.status(200).send({success:true,data:assetData});
    }).catch((err) => {
        return res.status(400).send({success:false,message: err });
    })
}

module.exports = {
    createAsset,
    getAssetDetails,
    getAssetsList
}
