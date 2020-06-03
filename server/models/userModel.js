const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var userModelSchema = new Schema({
    contact: { type: String, },
    email: { type: String, lowercase: true },
    password: String,
    firstName: { type: String, },
    lastName: { type: String, },
    middlename: { type: String },
    city: { type: String, },
    address: { type: String },
    country: { type: String },
    state: { type: String, },
    zip: { type: String, },
    profilePic: String,
    verifytoken: String,
    token: String,

    isDeleted: { type: Boolean, default: false },
    date: Number




}, { versionKey: false })

module.exports = mongoose.model('user', userModelSchema);

