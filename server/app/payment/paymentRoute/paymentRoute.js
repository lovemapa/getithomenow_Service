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
            console.log(`Payment error: `, error);

            return res.status(400).json({ message: error, success: CONSTANT.FALSE })
        })

    })






module.exports = payment
