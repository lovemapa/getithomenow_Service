const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var campaignSchema = new Schema({

    advertiser: { type: mongoose.Types.ObjectId, ref: "advertiser" },
    category: { type: mongoose.Types.ObjectId, ref: "productCategory" },
    subcategory: { type: mongoose.Types.ObjectId, ref: "productSubCategory" },
    otherCategory: String,
    advFormat: { type: String },
    description: String,
    title: String,
    mediaUrl: String,
    startDate: Number,
    endDate: Number,
    couponExpiry: Number,
    mediaThumbnail: String,
    redemtionType: String,
    redemtionCode: String,
    campaignType: String,
    monthlyBudget: Number,
    locationsForAdv: [{
        country: String,
        county: String,
        state: String,
    }],
    status: { type: Number, default: 0 },//0 for active , 1 for completed
    date: Number,
}, { versionKey: false });

module.exports = mongoose.model('campaign', campaignSchema);