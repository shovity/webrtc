'use strict';

const http = require('http'),
	express = require('express'),
	logger = require('morgan'),
	path = require('path');

var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res, next) => {
	res.render('home');
})

app.listen(80, () => {
	console.log('Server running at 80');
})