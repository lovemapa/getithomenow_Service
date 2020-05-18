const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var invitationSchema = new Schema({

    user: { type: mongoose.Types.ObjectId, ref: "user" },
    influencer: { type: mongoose.Types.ObjectId, ref: "influence" },
    referenceId: String,
    status: { type: Number, default: 0 },//0 for pending , 1 for accepted
    date: Number,
}, { versionKey: false });

module.exports = mongoose.model('invitation', invitationSchema);