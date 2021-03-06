const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var adminModelSchema = new Schema({
    email: { type: String, unique: true },
    password: { type: String },
    profilePic: String,
    contact: String,
    verifytoken: String,
    token: String,
    date: { type: Number },

}, { versionKey: false })

module.exports = mongoose.model('admin', adminModelSchema);