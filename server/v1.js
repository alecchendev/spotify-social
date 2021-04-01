const express = require('express')
const router = express.Router()




router.get('/:uri', (req, res) => {
	res.send({
		message: 'It worked!'
	})
});

module.exports = router;