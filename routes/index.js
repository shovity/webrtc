const express = require('express');

var router = express.Router();

router.get('/', (req, res, next) => {
	res.render('home', { cookies: req.cookies });
})

router.get('/cookie', (req, res, next) => {
	console.log(req.cookies)
	res.json(req.cookies);
});

module.exports = router;