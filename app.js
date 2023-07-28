var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var routes = require("./routes")
require("dotenv").config()
require("./config/db.config")

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/v1", routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).json({ 
    success: false,
    message: "Not Found"
   });
});

module.exports = app;
