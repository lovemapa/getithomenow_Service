'use strict'
const adminModel = require('../../../models/adminModel')
const carCategory = require('../../../models/carCategoryModel')
const bookingModel = require('../../../models/bookingModel')
const ownerModel = require('../../../models/ownerModel')
const vehicleModel = require('../../../models/vehicleModel')
const vehicleType = require('../../../models/vehicleType')
const promoCodeModel = require('../../../models/promoCodeModel')
const securityModel = require('../../../models/securityModel')
const eventModel = require('../../../models/eventModel')
const taxModel = require('../../../models/taxModel')
const userModel = require('../../../models/userModel')
const couponModel = require('../../../models/discountCouponModel')
const CONSTANT = require('../../../constant')
const rn = require('random-number')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')
const vehicleSchema = require('../../../models/vehicleImageModel')
const moment = require('moment')
const mongoose = require('mongoose')
const { Parser } = require('json2csv');

const fs = require('fs')


class admin {

    signUp(data) {

        return new Promise((resolve, reject) => {

            if (!data.email || !data.password) {
                reject(CONSTANT.EMAILPASSWORDPARAMS)
            }
            else {
                const adminRegster = this.createAdmin(data)
                adminRegster.save().then((saveresult) => {
                    resolve(saveresult)

                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
            }
        })
    }
    // --------Create Admin Registration Model------------
    createAdmin(data) {

        data.password = commonFunctions.hashPassword(data.password)
        let adminRegistrationData = new adminModel({
            email: data.email,
            password: data.password,
            date: moment().valueOf()
        })
        return adminRegistrationData;
    }

    //===========================================================================================
    // admin Login

    login(data) {
        return new Promise((resolve, reject) => {
            if (!data.password || !data.email) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                adminModel.findOne({ email: data.email }).then(result => {
                    if (!result) {
                        reject(CONSTANT.NOTREGISTERED)
                    }
                    else {
                        if (commonFunctions.compareHash(data.password, result.password)) {
                            resolve(result)
                        }
                        else
                            reject(CONSTANT.WRONGCREDENTIALS)
                    }
                })
            }

        })
    }

    forgotPassword(data) {
        return new Promise((resolve, reject) => {
            console.log(data);

            if (!data.email)
                reject('Kindly Provide Email')
            adminModel.findOne({ email: data.email }).then(result => {
                if (!result) {
                    reject(CONSTANT.NOTREGISTERED)
                }
                else {
                    const token = rn({
                        min: 1001,
                        max: 9999,
                        integer: true
                    })
                    adminModel.findOneAndUpdate({ email: data.email }, { $set: { verifytoken: token } }).then(updateToken => {
                        resolve(CONSTANT.VERIFYMAIL)
                    })
                    commonController.sendMail(data.email, result._id, token, 'admin', (result) => {

                        if (result.status === 1)
                            console.log(result.message.response);

                        else
                            reject(result.message)
                    })

                }
            })

        })
    }

    forgetPasswordVerify(body, query) {
        return new Promise((resolve, reject) => {

            if (body.confirmpassword != body.password)
                return reject("Password and confirm password not matched.")
            adminModel.findById(query.user).then(
                result => {

                    if (result && result.verifytoken == query.token) {

                        adminModel
                            .findByIdAndUpdate(query.user, {
                                password: commonFunctions.hashPassword(body.password),
                                verifytoken: ""
                            })
                            .then(
                                result1 => {
                                    return resolve('Password changed successfully.')
                                },
                                err => {
                                    return reject(err)
                                }
                            )
                    }
                    else {
                        return reject({ expired: 1 })
                    }
                },
                err => {
                    return reject(err)
                }
            )
        })
    }


}
module.exports = new admin()