const express = require('express')
const userController = require('../userControllers/userController')
const CONSTANT = require('../../../constant')
const rn = require('random-number')
const multer = require('multer');
const auth = require('../../auth/configuration')



const storage = multer.diskStorage({
  destination: process.cwd() + "/server/public/uploads/",
  filename: function (req, file, cb) {

    cb(
      null,
      "img_"
      +
      Date.now() +
      ".jpeg"
    );
  }
});
const upload = multer({ storage: storage })

let userRoute = express.Router()



// Save Details of user
userRoute.route('/register')
  .post((req, res) => {
    userController.signUp(req.body).then(result => {
      return res.json(result)
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })

  })
userRoute.route('/getAdvertisments')
  .get((req, res) => {

    userController.getAdvertisments(req.query.page, req.query.limit, req.query.name).then(result => {
      return res.json(result)
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

userRoute.route('/makeConsultant')
  .post((req, res) => {

    userController.makeConsultant(req.body).then(result => {
      return res.json(result)
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })



// logout user
userRoute.route('/logout/:userId')
  .get((req, res) => {
    userController.logout(req.params.userId).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        user: result
      })
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })

  })
userRoute.route('/verify')
  .get((req, res) => {
    userController.verify(req.query).then(result => {

      return res.send(`<h1 style="text-align:center; font-size:100px" >Verified successfully</h1>`)
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })

  })

//Check If Number Exists
userRoute.route('/checkContactExists')
  .post((req, res) => {
    userController.checkContactExists(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        message: result,

      })
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })

  })

//Complete user

userRoute.route('/updateProfile')
  .patch([auth.authenticateUser, upload.fields([{ name: 'profilePic', maxCount: 1 }])], (req, res) => {
    req.body.userId = req.headers.userId
    userController.updateProfile(req.body, req.files).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.UPDATEMSG,
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })



// User Login Email Password
userRoute.route('/login')
  .post((req, res) => {

    userController.login(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE, message: CONSTANT.TRUEMSG, user: result
      })
    }).catch(error => {
      console.log("error", error);
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

//sociallogin 
userRoute.post("/sociallogin", upload.single('profilePic'), (req, res) => {
  let body = req.body;
  userController
    .sociallogin(body, req.file)
    .then(result => {
      console.log(result);

      res.json({ success: 1, message: "Login successfully", "user": result });
    })
    .catch(err => {
      res.json({ success: 0, message: err });
    });
});





//update User Details
userRoute.route('/updateUser').
  put(upload.fields([{ name: 'profilePic', maxCount: 1 }]), (req, res) => {
    userController.updateUser(req.body, req.files).then(update => {

      return res.json({
        success: CONSTANT.TRUE,
        message: CONSTANT.UPDATEMSG,
        newEmail: update.newEmail,
        user: update.user
      })
    }).catch(error => {
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })


//Verify and send activation Mail to user 
userRoute.route('/verifyEmail')
  .post((req, res) => {
    userController.verifyEmail(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.VERFIEDTRUE
      })
    }).catch(err => {
      return res.json({ data: err, message: CONSTANT.NOTVERIFIED, success: CONSTANT.FALSE })

    })
  })

userRoute.route('/resendVerification')
  .put((req, res) => {
    userController.resendVerification(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE, message: CONSTANT.TRUEMSG, result: result
      })
    }).catch(err => {
      console.log(err);

      return res.json({ message: err, success: CONSTANT.FALSE })

    })
  })

userRoute.route('/forgetpassword').
  get((req, res) => {
    if (!(req.query.user || req.query.token)) {
      res.redirect('/server/app/views/404-page')
    }
    let message = req.flash('errm');
    console.log("messagev", message);

    res.render('forgetPassword', { title: 'Forget password', message })
  })


//Dislpay Home screen
userRoute.route('/displayHome').
  post((req, res) => {
    userController.displayHome(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })


//Dislpay Home screen
userRoute.route('/displayVehicleList').
  post((req, res) => {
    userController.displayVehicleList(req.body).then((result) => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })


//Display whole vehicle profile to user

userRoute.route('/displayVehicle/:vehicleId')
  .get((req, res) => {
    userController.displayVehicle(req.params.vehicleId).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

//Display whole vehicle profile to user

userRoute.route('/getUserReferral/:userId')
  .get((req, res) => {
    userController.getUserReferral(req.params.userId).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

//Forgot Password

userRoute.route('/forget-password')
  .post((req, res) => {

    userController.forgotPassword(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        message: CONSTANT.CHANGEPASSWORDLINK

      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })


// Verify Passowrd

userRoute.route('/forgetpassword').
  post((req, res) => {
    userController.forgetPasswordVerify(req.body, req.query).then(
      message => {
        // res.render('forgetPassword', { message: message, title: 'Forget password' })
        return res.redirect('http://getithomenow.com/#/login');
      },
      err => {
        if (err.expired) {
          return res.send(`<h1 style="text-align:center; font-size:100px" >Forget password link has been expired.</h1>`)
        }
        req.flash('errm', err)

        let url = `/api/user/forgetpassword?token=${req.query.token}&user=${req.query.user}`
        res.redirect(url)
      }
    )
  })

userRoute.route('/completeRegistration')
  .patch((req, res) => {
    userController.completeRegistration(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.SIGNUPSUCCESS
      })
    }).catch(err => {
      console.log(err);

      return res.json({ message: err, success: CONSTANT.FALSE })

    })
  })

// Get list of service List
// userRoute.route('/servicesList')
//   .post((req, res) => {
//     userController.servicesList(req.body).then(result => {
//       return res.send({
//         success: CONSTANT.TRUE,
//         data: result
//       })
//     }).catch(err => {
//       console.log(err);
//       return res.json({ message: err, success: CONSTANT.FALSE })
//     })
//   })

//Get list of particular service Provider
// userRoute.route('/servicesList/:_id')
//   .get((req, res) => {
//     userController.displayProfile(req.params._id).then(result => {
//       return res.send({
//         success: CONSTANT.TRUE,
//         data: result
//       })
//     }).catch(err => {
//       console.log(err);
//       return res.json({ message: err, success: CONSTANT.FALSE })
//     })
//   })

//Create Booking
userRoute.route('/createBooking')
  .post((req, res) => {
    userController.createBooking(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.BOOKSUCCESSFULL
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Get request List
userRoute.route('/getRequestList')
  .post((req, res) => {
    userController.getRequestList(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//add Favourites
userRoute.route('/addFavourites')
  .patch((req, res) => {
    userController.addFavourites(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.ADDMSG
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })


// Show Favourites List
userRoute.route('/showFavourites/:_id')
  .get((req, res) => {
    userController.showFavourites(req.params._id).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result

      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Remove Favourites
userRoute.route('/removeFavourites/:serviceId')
  .delete((req, res) => {
    userController.removeFavourites(req.params.serviceId).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        message: CONSTANT.REMOVEFAV
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Provide Ratings to service
userRoute.route('/provideServiceRatings')
  .patch((req, res) => {
    userController.provideServiceRatings(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        message: CONSTANT.UPDATEMSG
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Add issue by service
userRoute.route('/addIssue')
  .post(upload.fields([{ name: 'issueimage', maxCount: 1 }]), (req, res) => {
    userController.addIssue(req.body, req.files).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.ISSUESUCCESSFULLY
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//get Nearby Cars
userRoute.route('/getNearbyCars')
  .post((req, res) => {
    userController.getNearbyCars(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.ISSUESUCCESSFULLY
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

userRoute.route('/changePassword').
  put((req, res) => {
    userController.changePassword(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE, message: CONSTANT.UPDATEMSG, user: result
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })
// get user promo code
userRoute.route('/getUserPromoCode')
  .post((req, res) => {
    userController.getUserPromoCode(req.body).then((result, count) => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        count: count
      })
    }).catch(error => {
      console.log(error);
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

//Apply promo
userRoute.route('/applyPromo').
  post((req, res) => {
    userController.applyPromo(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })
//Apply Coupon
userRoute.route('/applyCoupon').
  post((req, res) => {
    userController.applyCoupon(req.body).then(result => {
      return res.json({

        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

// userController.cronJob()

//Get booking request List
userRoute.route('/bookings')
  .post((req, res) => {
    userController.getBookingsList(req.body).then((result, totalItem) => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        totalItem: totalItem
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//Get past booking request List
userRoute.route('/pastBookings')
  .post((req, res) => {
    userController.getPastBookingsList(req.body).then((result, totalItem) => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result,
        totalItem: totalItem
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//helpCenter api
userRoute.route('/helpCenter').
  post(upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    userController.helpCenter(req.body, req.files).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        message: CONSTANT.HELPCENTER
      })
    }).catch(error => {
      console.log("error", error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

//Get past booking request List
userRoute.route('/rating')
  .post((req, res) => {
    userController.rating(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

userRoute.route('/notificationSetting')
  .post((req, res) => {
    userController.notification(req.body).then(result => {
      return res.send({
        success: CONSTANT.TRUE,
        message: CONSTANT.NOTIFICATIONSTATUS,
        data: result
      });
    }).catch(err => {
      console.log(err);
      return res.json({ message: err, success: CONSTANT.FALSE })
    })
  })

//get notification of particular owner
userRoute.route('/booking/:bookingId')
  .get((req, res) => {
    userController.getBookingsById(req.params.bookingId).then(item => {
      return res.json({
        success: CONSTANT.TRUE,
        data: item.result,
        isRated: item.isRated
      })
    }).catch(error => {
      console.log(error);
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

// get user by Referral code
userRoute.route('/getUserByReferral')
  .post((req, res) => {
    userController.getBookingsByReferral(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log(error);
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

// get review
userRoute.route('/review')
  .post((req, res) => {
    userController.getReview(req.body).then((result, count) => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        count: count
      })
    }).catch(error => {
      console.log(error);
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })


// get user promo code
userRoute.route('/getUserPromoCode')
  .post((req, res) => {
    userController.getUserPromoCode(req.body).then((result, count) => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        count: count
      })
    }).catch(error => {
      console.log(error);
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

// get review
userRoute.route('/addPromoToUser')
  .post((req, res) => {
    userController.addPromoToUser(req.body).then((result, count) => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result,
        count: count
      })
    }).catch(error => {
      console.log(error);
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })
userRoute.route('/cancleBooking')
  .post((req, res) => {
    userController.cancleBooking(req.body).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

userRoute.route('/notify')
  .get((req, res) => {
    userController.notify().then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })
//get user detail by id
userRoute.route('/:userId')
  .get((req, res) => {
    userController.displayUserInfo(req.params.userId).then(result => {
      return res.json({
        success: CONSTANT.TRUE,
        data: result
      })
    }).catch(error => {
      console.log(error);

      return res.json({ message: error, success: CONSTANT.FALSE })
    })
  })

module.exports = userRoute;