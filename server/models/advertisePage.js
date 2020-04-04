const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var advertisePage = new Schema({


    advertiser: { type: Schema.Types.ObjectId, required: true, ref: 'advertiser' },
    name: { type: String, },
    address: { type: String },
    website: { type: String },
    headlines: { type: String },
    description: { type: String },
    phone: { type: String },
    hoursOfOperation: {
        sun: {
            startTime: { type: String },
            endTime: { type: String },
        },
        mon: {
            startTime: { type: String },
            endTime: { type: String },
        },
        tue: {
            startTime: { type: String },
            endTime: { type: String },
        },
        wed: {
            startTime: { type: String },
            endTime: { type: String },
        },
        thu: {
            startTime: { type: String },
            endTime: { type: String },
        },
        fri: {
            startTime: { type: String },
            endTime: { type: String },
        },
        sat: {
            startTime: { type: String },
            endTime: { type: String },
        }

    },

    isDeleted: { type: Boolean, default: false },
    date: { type: Number },


}, { versionKey: false })


module.exports = mongoose.model('advertiserPage', advertisePage);