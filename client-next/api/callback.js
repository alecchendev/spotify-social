
// Login/auth callback

const cookie = require('cookie');
const cookies = require('cookies');
const url = require('url');

module.exports = (req, res) => {
	// const { jwtToken, id } = req.query;
  const { jwtToken, id } = url.parse(req.url, true, true).query;

  // res.cookie('jwtToken', jwtToken, {
  // 	expires: new Date(Date.now() + (1000 * 60 * 30)),
  // 	httpOnly: true
  // });

  // res.setHeader('Set-Cookie', cookie.serialize('jwtToken', jwtToken, {
  //   httpOnly: true,
  //   maxAge: 60 * 60 * 24 * 7 // 1 week
  // }));

  cookies.set('jwtToken', jwtToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 30),
    sameSite: 'lax',
  });

  // const fullUrl = req.protocol + '://' + req.get('host');

  res.redirect('/account/' + id);
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