const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var redemptionCategorySchema = new Schema({
    name: { type: String, },

}, { versionKey: false });

module.exports = mongoose.model('redemption', redemptionCategorySchema);