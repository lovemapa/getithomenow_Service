const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var productCategorySchema = new Schema({
    name: { type: String, },

}, { versionKey: false });

module.exports = mongoose.model('productCategory', productCategorySchema);