
const express = require('express');
const app = express();

app.get('/', (req, res) => {

	res.send({
		sanityCheck: 'sane',
		url: req
	});
});

module.exports = app;