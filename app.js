'use strict';

const http = require('http'),
	express = require('express'),
	logger = require('morgan'),
	path = require('path'),
	cookieParser = require('cookie-parser');

const io = require('./socket'),
	index = require('./routes/index');

const port = process.env.PORT || 3000;

const app = express(),
	server = http.createServer(app);

app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(index);

io.attach(server);

server.listen(port, () => {
	console.log(`Server listening at ${port}`);
})

