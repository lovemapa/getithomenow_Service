const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var influenceModelSchema = new Schema({


    email: { type: String, unique: true },
    userId: { type: String, unique: true },
    companyName: { type: String },
    companyWebsite: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    title: { type: String },
    primaryPhone: { type: String },
    mobile: { type: String },
    address: { type: String },
    token: String,
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    isDeleted: { type: Boolean, default: false },
    date: { type: Number },
    verifytoken: String,
    role: { type: Number, default: 2 },
    referenceId: String,
    taxId: { type: String }


}, { versionKey: false })


module.exports = mongoose.model('influence', influenceModelSchema);