
// Login/auth callback
const app = require('express')()

app.get('/api/callback', (req, res) => {
	const { jwtToken, id } = req.query;

  res.cookie('jwtToken', jwtToken, {
  	expires: new Date(Date.now() + (1000 * 60 * 30)),
  	httpOnly: true
  });

  const fullUrl = req.protocol + '://' + req.get('host');

  res.redirect(fullUrl + '/account/' + id);
})

module.exports = app


// module.exports = (req, res) => {

// 	const { jwtToken, id } = req.query;

//   res.cookie('jwtToken', jwtToken, {
//   	expires: new Date(Date.now() + (1000 * 60 * 30)),
//   	httpOnly: true
//   });

//   const fullUrl = req.protocol + '://' + req.get('host');

//   res.redirect(fullUrl + '/account/' + id);

// };