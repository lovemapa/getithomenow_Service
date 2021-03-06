const mongoose = require('mongoose');
const constants = require('./../constant');

const Schema = mongoose.Schema;


var paymentModelSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'user' },
    email: { type: String },
    chargeId: { type: String },
    customerId: { type: String },
    phone: { type: String },
    itemList: { type: Array },
    special_instructions: String,
    amount: Number,
    pickUpAddress: {
        formattedAddress: String,
        lat: Number,
        lng: Number
    },
    bookingDate: Number,
    deliveryAddress: {
        formattedAddress: String,
        lat: Number,
        lng: Number
    },
    rightNow: { type: Boolean, default: false },
    timeSlot: String,
    billing_details: {
        address: {
            city: String,
            country: String,
            line1: String,
            line2: String,
            postal_code: String,
            state: String
        },

    },
    name: String,
    date: Number
}, { timestamps: false, versionKey: false })



module.exports = mongoose.model('booking', paymentModelSchema);