const express = require("express");



const admin = require('../app/admin/adminRoutes/adminRoutes')


const route = express.Router()

route.use('/admin', admin)


module.exports = route;