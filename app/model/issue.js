const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//================================
// Issue Schema
//================================
const IssueSchema = new Schema({
    assetId: {
        type: Schema.Types.ObjectId,
        ref: "Asset",
        required: true
    },
    empId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    issue_date: {
        type: Date,
        default: new Date()
    },
    return_date: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['issued','returned'],
        default: 'issued'
    },
    repair_cost: {
        type: Number,
        default: 0 
    }
},{
    timestamps: true
});

var IssueModel = mongoose.model('Issue',IssueSchema);
module.exports = IssueModel;
