'use strict'
const adminModel = require('../../../models/adminModel')
const advetiseModel = require('../../../models/advertisePage')

const CONSTANT = require('../../../constant')
const rn = require('random-number')
const commonFunctions = require('../../common/controllers/commonFunctions')
const commonController = require('../../common/controllers/commonController')
const vehicleSchema = require('../../../models/vehicleImageModel')
const moment = require('moment')
const mongoose = require('mongoose')
const { Parser } = require('json2csv');
const auth = require('../../auth/configuration')




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
        const token = auth.generateToken(adminRegistrationData._id)
        adminRegistrationData.set('date', moment().valueOf(), { strict: false })
        adminRegistrationData.set('token', token, { strict: false })
        return adminRegistrationData;
    }

    //===========================================================================================
    // admin Login

    login(data) {
        return new Promise(async (resolve, reject) => {
            if (!data.password || !data.email) {
                reject(CONSTANT.MISSINGPARAMS)
            }
            else {
                const user = await adminModel.findOne({ $or: [{ email: data.email }] })
                if (user) {
                    const token = auth.generateToken(user._id)




                    adminModel.findOneAndUpdate({ email: data.email },
                        { $set: { token: token } },

                        { new: true })

                        .then(updateResult => {
                            if (commonFunctions.compareHash(data.password, updateResult.password)) {
                                {
                                    resolve(updateResult)
                                }
                            } else {

                                reject(CONSTANT.WRONGCREDENTIALS)
                            }

                        })
                }
                else {
                    reject(CONSTANT.NOTREGISTERED)
                }

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

    createAdvertisement(data) {

        return new Promise((resolve, reject) => {

            if (!data.name || !data.mainContent || !data.phone) {
                reject(CONSTANT.CONTACTNAMEMISSING)
            }
            else {
                data.date = moment().valueOf()
                const advertise = new advetiseModel(data)
                advertise.save().then((saveresult) => {
                    resolve(saveresult)

                }).catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))

                    return reject(error)
                })
            }
        })
    }

    updateAdvertisment(data) {
        return new Promise((resolve, reject) => {
            if (!data.advertiseId) {
                reject("Advertisment Id is missing")
            }
            advetiseModel.findByIdAndUpdate(data.advertiseId, data, { new: true }).then(async updateResult => {

                if (updateResult) {
                    resolve(updateResult)
                }
            }).catch(error => {

                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }

    deleteAdvertisment(data) {
        return new Promise((resolve, reject) => {
            if (!data.advertiseId) {
                reject("Advertisment Id is missing")
            }
            advetiseModel.findByIdAndUpdate(data.advertiseId, { isDeleted: true }, { new: true }).then(async updateResult => {

                if (updateResult) {
                    resolve(updateResult)
                }
            }).catch(error => {

                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }

    getAdvertisments(name) {
        return new Promise((resolve, reject) => {
            let query = {}

            query.isDeleted = false
            if (name)
                query.$or = [{ mainContent: { $regex: new RegExp(name), $options: 'i' } },
                { name: { $regex: new RegExp(name), $options: 'i' } },
                { phone: { $regex: new RegExp(name), $options: 'i' } },
                ]


            advetiseModel.find(query).then(data => {

                if (data) {
                    resolve(data)
                }
            }).catch(error => {

                if (error.errors)
                    return reject(commonController.handleValidation(error))
                return reject(error)
            })
        })
    }

    updateProfile(data, file) {
        return new Promise((resolve, reject) => {

            let query = {}

            adminModel.findOne({ _id: data._id }).then(oldPass => {
                if (file)
                    query.profilePic = '/' + file.filename
                if (data.contact)
                    query.contact = data.contact


                if (data.oldPassword && oldPass.password) {
                    if (commonFunctions.compareHash(data.oldPassword, oldPass.password)) {

                        query.password = commonFunctions.hashPassword(data.newPassword)
                    }
                    else {
                        reject(CONSTANT.WRONGOLDPASS)
                    }
                }
                adminModel.findByIdAndUpdate({ _id: data._id }, { $set: query }, { new: true }).then(update => {
                    resolve(update)
                })




            })
                .catch(error => {
                    if (error.errors)
                        return reject(commonController.handleValidation(error))
                    if (error)
                        return reject(error)
                })

        })
    }

}
module.exports = new admin()