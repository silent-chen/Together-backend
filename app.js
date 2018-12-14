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
let middleware = require('./utils/middlewares');

let customers = require('./routes/customers');
let friends = require('./routes/friends');
let post = require('./routes/post');
let login = require('./routes/login');
let register = require('./routes/register');
let oauth = require('./routes/oauth');

const app = express();

// http request log to terminal
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(middleware.cors);
app.use(middleware.authorize);

// use middleware to get the tenant for req
app.use(function(req, res, next) {
    let dnsFields = req.headers['host'].split('.');
    req.tenant = dnsFields[0];
    next();
});

app.get('/api/customers', customers.getByQuery);
app.post('/api/customers', customers.post);
// post
app.get('/api/post', post.search);
app.get('/api/post/:username', post.getByUsername);
app.post('/api/post/:username', post.post);
app.delete('/api/post/:username', post.del);

// friend
app.get('/api/friends', friends.get);
app.post('/api/friends', friends.post);
app.get('/api/friends/:username', friends.getByUsername);

app.post('/api/register', register.post);
app.post('/api/login', login.post);
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