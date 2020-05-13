const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const morgan = require('morgan')
const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session')
const app = new express();
const cors = require("cors");

// const http = require('http').Server(app);
// const io = require('socket.io')(http);
const SitemapGenerator = require('sitemap-generator');


let OPTIONS = {
    key: fs.readFileSync('/etc/apache2/ssl/getithomenow.com.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/ba2f889480dfa6c.crt')
}

const http = require('https').createServer(OPTIONS, app);

const generator = SitemapGenerator('https://getithomenow.com', {
    stripQuerystring: false
});


generator.on('done', () => {

});


generator.start();



dotenv.config();


app.use(cors())
app.use(express.static(path.join(process.cwd() + "/server/public/uploads/")));
app.use(express.static(path.join(process.cwd() + "/public/csv/")));

app.use(session({
    secret: 'user_id',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    }
}))
app.use(flash());
app.use(morgan('dev'))
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
app.use(function (req, res, next) {
    let hour = 3600000
    req.session.cookie.expires = new Date(Date.now() + hour)
    req.session.cookie.maxAge = 100 * hour;
    next()
})
const api = require('./app/route')
app.use("/static", express.static(path.join(__dirname, "../server/uploads")))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,authtoken"
    );
    next();
});
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use("/api", api);

//DB connection
mongoose.connect('mongodb://localhost:27017/evertte', { useNewUrlParser: true, useCreateIndex: true }, (err, data) => {
    if (err) console.log(err)
    else console.log("Mongo DB connected")
});
mongoose.set('useFindAndModify', false);


http.listen(8081, () => {

    console.log(`🚀 app listening on port 8081!`)
})
