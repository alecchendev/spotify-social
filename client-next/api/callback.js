
// Login/auth callback

const cookie = require('cookie');

module.exports = (req, res) => {
	const { jwtToken, id } = req.query;

  // res.cookie('jwtToken', jwtToken, {
  // 	expires: new Date(Date.now() + (1000 * 60 * 30)),
  // 	httpOnly: true
  // });

  res.setHeader('Set-Cookie', cookie.serialize('jwtToken', jwtToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  }));

  const fullUrl = req.protocol + '://' + req.get('host');

  res.redirect(fullUrl + '/account/' + id);
};


// module.exports = (req, res) => {

// 	const { jwtToken, id } = req.query;

//   res.cookie('jwtToken', jwtToken, {
//   	expires: new Date(Date.now() + (1000 * 60 * 30)),
//   	httpOnly: true
//   });

//   const fullUrl = req.protocol + '://' + req.get('host');

//   res.redirect(fullUrl + '/account/' + id);

// };