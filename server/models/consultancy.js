const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var consultancySchema = new Schema({
    name: { type: String },
    email: { type: String },
    contact: { type: String },
    message: { type: String },
}, { timestamps: true, versionKey: false })



module.exports = mongoose.model('consultancy', consultancySchema);

