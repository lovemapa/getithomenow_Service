const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var productSubCategorySchema = new Schema({
    name: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: "productCategory" }

}, { versionKey: false });

module.exports = mongoose.model('productSubCategory', productSubCategorySchema);