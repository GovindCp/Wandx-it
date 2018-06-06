const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//================================
// Asset Schema
//================================
const AssetSchema = new Schema({
    asset_name: {
        type: String, 
        required: true
    },
    asset_tag: {
        type: String,
        required: true
    },
    asset_serial_no: {
        type: String,
        required: true,
    },
    asset_brand: {
        type: String,
        required: true
    },
    assets_description: {
        type : Schema.Types.Mixed
    },
    asset_purchased_price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    asset_purchased_date: {
        type: Date,
        required: true,
        default: new Date() 
    },
    vendor_details: {
        type: Schema.Types.Mixed
    },
    warranty_period: {
        type: String,
    },
},
{
    timestamps: true
});

var AssetModel = mongoose.model('Asset',AssetSchema);
module.exports = AssetModel;
