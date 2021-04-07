
module.exports = (req, res) => {

	res.send({
		sanityCheck: 'sane',
		stuff: req.query
	});
};