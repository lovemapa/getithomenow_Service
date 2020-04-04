const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var userModelSchema = new Schema({
    contact: { type: String, default: '' },
    email: { type: String },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    date: Number




}, { versionKey: false })

module.exports = mongoose.model('user', userModelSchema);

