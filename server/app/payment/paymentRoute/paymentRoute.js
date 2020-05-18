const express = require('express')
const adminController = require('../paymentController/authorize')
const CONSTANT = require('../../../constant')
const multer = require('multer');
const auth = require('../../auth/configuration')




const payment = express.Router()


//Make payment

payment.route('/makePayment')
    .post((req, res) => {
        adminController.makePayment(req.body, (result) => {


        }).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.PAYMENTSUCCESS,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, success: CONSTANT.FALSE })
        })

    })

//Make payment

payment.route('/authorizeCreditCard')
    .post((req, res) => {
        adminController.authorizeCreditCard(req.body, (result) => {


        }).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.CAPTURECARD,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, success: CONSTANT.FALSE })
        })

    })



module.exports = payment
