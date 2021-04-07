
module.exports = (req, res) => {

	res.cookie('cookieTest', 'hello', {
		httpOnly: true
	}),

	res.send({
		sanityCheck: 'sane'
	});
};