const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var advertisement = new Schema({


    name: { type: String, },
    phone: { type: String },
    mainContent: String,

    isDeleted: { type: Boolean, default: false },
    date: { type: Number },


}, { versionKey: false })


module.exports = mongoose.model('advertisement', advertisement);