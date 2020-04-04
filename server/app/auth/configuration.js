let jwt = require("jsonwebtoken");
let advertiseModel = require("../../models/advertiser");
const influenceModel = require('../../models/influencer')
// let userModel = require("../models/user/user");
// let Admin = require("../models/admin/admin");
var nodemailer = require('nodemailer');
var CONSTANT = require('../../constant')

let authenticate = {
    /**
     * Generates a token
     */
    generateToken: user => {
        // Gets expiration time
        const expiration = 240;
        // returns signed and encrypted token 
        token = jwt.sign(
            {
                data: {
                    _id: user
                }
            },
            "supersecret"
        )
        return token;
    },


    // Authentication and Authorization Middleware
    authenticateAdvertiser: (req, res, next) => {
        if (req.headers.token) {
            if (req.headers.token === 'Bearer mytoken123')
                next()
            else {
                advertiseModel.findOne({ token: req.headers.token }).then(result => {
                    if (result) {
                        jwt.verify(req.headers.token, "supersecret", (err, decoded) => {
                            req.headers.userId = decoded.data._id
                            next()
                        });
                    }
                    else return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization not correct', uiMessage: 'Authorization not correct', logout: 1 })
                })
            }
        } else {
            return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization is missing', uiMessage: 'Authorization is missing', logout: 1 })

        }
    },

    // Authentication and Authorization Middleware
    authenticateInfluencer: (req, res, next) => {
        if (req.headers.token) {
            if (req.headers.token === 'Bearer mytoken123')
                next()
            else {
                influenceModel.findOne({ token: req.headers.token }).then(result => {
                    if (result) {
                        jwt.verify(req.headers.token, "supersecret", (err, decoded) => {
                            req.headers.userId = decoded.data._id
                            next()
                        });
                    }
                    else return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization not correct', uiMessage: 'Authorization not correct', logout: 1 })
                })
            }
        } else {
            return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization is missing', uiMessage: 'Authorization is missing', logout: 1 })

        }
    },

    // Authentication and Authorization Middleware
    authenticateUser: (req, res, next) => {
        if (req.headers.token) {
            if (req.headers.token === 'Bearer mytoken123')
                next()
            else {
                userModel.findOne({ token: req.headers.token }).then(result => {
                    if (result) {
                        jwt.verify(req.headers.token, "supersecret", (err, decoded) => {
                            req.headers.userId = decoded.data._id
                            next()
                        });
                    }
                    else return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization not correct', uiMessage: 'Authorization not correct', logout: 1 })
                })
            }
        } else {
            return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization is missing', uiMessage: 'Authorization is missing' })
        }
    },


    // Authentication and Authorization Middleware
    authenticateAdmin: (req, res, next) => {
        if (req.headers.token) {
            if (req.headers.token === 'Bearer mytoken123')
                next()
            else {
                Admin.findOne({ token: req.headers.token }).then(result => {
                    console.log(result, '---- result ', req.headers.token)
                    if (result) {
                        jwt.verify(req.headers.token, "supersecret", (err, decoded) => {
                            req.headers.userId = decoded.data._id
                            next()
                        });
                    }
                    else return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization not correct', uiMessage: 'Authorization not correct', logout: 1 })
                })
            }
        } else {
            return res.json({ code: CONSTANT.UNAUTHRIZEDCODE, developerMessage: 'Authorization is missing', uiMessage: 'Authorization is missing' })
        }
    },

    sendMail(message, image) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gethired20200@gmail.com',
                pass: 'mangogethired20200'
            }
        });
        const mailOptions = {
            from: 'gethired20200@gmail.com', // sender address
            to: 'pankaj.sharma@apptunix.com', // list of receivers
            subject: 'Support message from App', // Subject line
            html: 'message: ' + message,// plain text body
        };

        if (image) mailOptions.attachments = [{ path: image }]

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    },


};

module.exports = authenticate;