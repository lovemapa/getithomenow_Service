const express = require("express");



const admin = require('../app/admin/adminRoutes/adminRoutes')
const user = require('../app/user/userRoutes/userRoute')
const payment = require("../app/payment/paymentRoute/paymentRoute")

const route = express.Router()

route.use('/admin', admin)
route.use('/user', user)
route.use('/payment', payment)

module.exports = route;