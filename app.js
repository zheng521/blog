'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes/index');
var cloud = require('./cloud');
var session = require('express-session');
var app = express();

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:"1234",	
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
  resave: false,
  saveUninitialized: true
}));

router(app);


module.exports = app;