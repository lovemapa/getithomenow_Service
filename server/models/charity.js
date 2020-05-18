const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var charityModelSchema = new Schema({


    userId: { type: String, unique: true },
    email: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    website: { type: String, unique: true },
    missionStatement: { type: String },
    program: { type: String },
    yearFounded: { type: String },
    taxId: { type: String },
    charityType: { type: String },
    state: { type: String },
    zip: { type: String },
    date: { type: Number },



}, { versionKey: false })


module.exports = mongoose.model('charity', charityModelSchema);