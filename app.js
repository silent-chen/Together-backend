/*
 * The RESTful backend of the project.
 * If possible, separate the the frontend to another repo
 */
let express = require('express');
let path = require('path');
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logging = require('./utils/logging');

let customers = require('./routes/customers');
let oauth = require('./routes/oauth');

const app = express();

// http request log to terminal
app.use(morgan('dev'));

// extract the entire body portion of an incoming request stream
// and exposes it on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Parse Cookie header and populate req.cookies
// with an object keyed by the cookie names.
app.use(cookieParser());

// use middleware to get the tenant for req
app.use('/', function(req, res, next) {
    logging.debug_message("headers = ", req.headers);
    let dnsFields = req.headers['host'].split('.');
    req.tenant = dnsFields[0];
    next();
});

// Connect paths to route handlers.
// I have had problems with the Router module in Express and do it this way.
// This could all be driven off of a config file.
app.get('/api/customers/:id', customers.getById);
app.get('/api/customers', customers.getByQuery);
app.post('/api/customers', customers.post);

app.post('/api/oauth', oauth.post);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).json({ error: err.status || 500 });
});

module.exports = app;