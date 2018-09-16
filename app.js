var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongodb_conn, { useNewUrlParser: true });

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/v1', apiRouter);

module.exports = app;
