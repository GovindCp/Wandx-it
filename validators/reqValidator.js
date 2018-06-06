const validate = require("validate.js");

var constraints = {
    "registerUser": {
        "emp_id": {
            "presence": true
        },
        "emp_name": {
            "presence": true
        },
        "dept_name": {
            "presence": true
        },
        "emp_countrycode": {
            "presence": true
        },
        "emp_contactnumber": {
            "presence": true
        },
        "emp_address": {
            "presence": true
        },
        "role": {
            "presence": true,
            "inclusion" : {
                "within": ["Admin","Developer"],
                "message": "is not valid role type"
            }
        }
    },
    "login": {
        "emp_id": {
            "presence": true
        },
        "password": {
            "presence": true
        }
    },
    "forgotPassword": {
        "emp_id": {
            "presence": true
        }
    },
    "verifyOtp": {
        "emp_id": {
            "presence": true
        },
        "otp": {
            "presence": true
        },
        "newPassword": {
            "presence": true
        },
        "confirmPassword": {
            "presence": true,
            "equality":"newPassword"
        }
    },
    "createAsset":{
        "asset_name":{
            "presence": true,
        },
        "asset_tag":{
            "presence":true,
        },
        "asset_serial_no":{
            "presence": true
        },
        "asset_brand":{
            "presence": true
        },
        "assets_description":{
            "presence": true
        },
        "asset_purchased_price": {
            "presence": true
        },
        "vendor_details": {
            "presence": true
        },
        "warranty_period": {
            "presence": true
        }
    },
    "assetDetails":{
        "assetId": {
            "presence": true
        }
    },
    "getAssetsList": {}
};

module.exports.getAssetDetailsValidate = function (body) {
    return validate.async(body, constraints.assetDetails);
};

module.exports.createAssetValidate = function (body) {
    return validate.async(body, constraints.createAsset);
};

module.exports.userRegValidate = function (body) {
    return validate.async(body, constraints.registerUser);
};

module.exports.loginValidator = function (body) {
    return validate.async(body, constraints.login);
};

module.exports.forgotPasswordValidator = function (body) {
    return validate.async(body, constraints.forgotPassword);
};

module.exports.verifyOtpValidator = function (body) {
    return validate.async(body, constraints.verifyOtp);
};

module.exports.getAssetsListValidate = function (body) {
    return validate.async(body, constraints.getAssetsList);
};



