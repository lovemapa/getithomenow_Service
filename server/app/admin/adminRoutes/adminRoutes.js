const express = require('express')
const adminController = require('../adminControllers/adminController')
const CONSTANT = require('../../../constant')
const multer = require('multer');
const auth = require('../../auth/configuration')




const adminRoute = express.Router()
const storage = multer.diskStorage({
    destination: process.cwd() + "/server/public/uploads/",
    filename: function (req, file, cb) {

        cb(
            null,
            rn({
                min: 1001,
                max: 9999,
                integer: true
            }) +
            "_" +
            Date.now() +
            `.${file.originalname.split('.').pop()}`
        );
    }
});
const upload = multer({ storage: storage }).single('file')
const uploadMulti = multer({ storage: storage })

//Register Admin 
adminRoute.route('/register')
    .post((req, res) => {
        adminController.signUp(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.SIGNUPSUCCESS,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, success: CONSTANT.FALSE })
        })

    })

// Login Admin
adminRoute.route('/login')
    .post(upload, (req, res) => {
        adminController.login(req.body, req.file, req.params._id).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.LOGINSUCCESS,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, success: CONSTANT.FALSE })
        })

    })

adminRoute.route('/forgetpassword').
    get((req, res) => {
        if (!(req.query.user || req.query.token)) {
            res.redirect('/server/app/views/404-page')
        }
        let message = req.flash('errm');
        console.log("messagev", message);

        res.render('forgetPassword', { title: 'Forget password', message })
    })



//Forgot Password

adminRoute.route('/forget-password')
    .post((req, res) => {

        adminController.forgotPassword(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                message: CONSTANT.CHANGEPASSWORDLINK

            })
        }).catch(error => {
            console.log("error", error);

            return res.json({ message: error, success: CONSTANT.FALSESTATUS })
        })
    })


// Verify Passowrd

adminRoute.route('/forgetpassword').
    post((req, res) => {
        adminController.forgetPasswordVerify(req.body, req.query).then(
            message => {
                res.render('forgetPassword', { message: message, title: 'Forget password' })
            },
            err => {
                if (err.expired) {
                    return res.send(`<h1 style="text-align:center; font-size:100px" >Forget password link has been expired.</h1>`)
                }
                req.flash('errm', err)

                let url = `/admin/forgetpassword?token=${req.query.token}&user=${req.query.user}`
                res.redirect(url)
            }
        )
    })

//create advertisement page
adminRoute.route('/createAdvertisement')
    .post(auth.authenticateAdmin, (req, res) => {
        adminController.createAdvertisement(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.ADDMSG,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, success: CONSTANT.FALSE })
        })

    })

//update influencer data
adminRoute.route('/updateAdvertisment')
    .patch(auth.authenticateAdmin, (req, res) => {

        adminController.updateAdvertisment(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.UPDATEMSG,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, success: CONSTANT.FALSE })
        })
    })

//update influencer data
adminRoute.route('/deleteAdvertisment')
    .patch(auth.authenticateAdmin, (req, res) => {

        adminController.deleteAdvertisment(req.body).then(result => {
            return res.json({
                success: CONSTANT.TRUE,
                data: result,
                message: CONSTANT.DELETEMSG,

            })
        }).catch(error => {
            console.log(error);

            return res.json({ message: error, success: CONSTANT.FALSE })
        })
    })


module.exports = adminRoute