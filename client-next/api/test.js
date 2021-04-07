
module.exports = (req, res) => {

	res.send({
		sanityCheck: 'sane',
		req: req
	});
};