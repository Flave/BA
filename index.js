var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');

mongoose.Promise = require('promise');
var configDB = require('./config/db');

//app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
mongoose.connect(configDB.url); // connect to our database
require('./server/passport')(passport); // pass passport for configuration


// set up our express application
app.use(require('morgan')('combined'));
app.use(require ('cookie-parser')()); // read cookies (needed for auth)
app.use(require ('body-parser').urlencoded({extended: true})); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// required for passport
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(require('./server/routes/app')); 
// load authentication routes and pass in fully configured passport
app.use(require('./server/routes/auth')(passport));
// load api routes
app.use(require('./server/routes/api')); 

app.listen(port);
console.log('The magic happens on port ' + port);