const express = require("express");



const admin = require('../app/admin/adminRoutes/adminRoutes')
const user = require('../app/user/userRoutes/userRoute')

const route = express.Router()

route.use('/admin', admin)
route.use('/user', user)

module.exports = route;