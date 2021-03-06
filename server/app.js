var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db/db');
var multer = require('multer');
//var enforce = require('express-sslify');

var index = require('./routes/index');
var restapi = require('./routes/restapi');

var app = express();
// disabled when testing
//app.use(enforce.HTTPS(true));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.enable('trust proxy');
// defaults includeEmptyFields to false
// TODO also check what happens when i upload more than 1 file, and files in another name than 'image'
// TODO implement socket.io for emitting upload progress to the client. (but how???)
app.use(multer({
    dest: './server/public/uploads/', limits: {
        files: 1,
        fields: 10
    }
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false, limit: '16384kb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/app')));

app.use('/', index);
if (app.get('env') === 'production') {
    app.use(function (req, res, next) {
        console.log('Production mode');
        next();
    });
}
app.use('/api', restapi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
