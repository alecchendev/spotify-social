require('dotenv').config({ path: require('find-config')('.env') });
const { generateRandomString } = require('./utils');
const querystring = require('querystring');
const axios = require('axios');
const express = require('express');
const router = express.Router();

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const redirectUri = [url, process.env.API_VERSION, 'callback'].join('/');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = [
	'user-top-read'
].join(' ');


router.get('/login', (req, res) => {


  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
    })
	);

});

router.get('/callback', async (req, res) => {

	const code = req.query.code;

	const authOptions = {
		method: 'post',
		url: 'https://accounts.spotify.com/api/token',
		params: {
			code: code,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
		},
		json: true
	};

	try {

		const authRes = await axios(authOptions);
		// console.log(authRes);
		const { access_token, token_type, refresh_token } = authRes.data;
		console.log([access_token, token_type, refresh_token].join('\n'));

		const userOptions = {
			method: 'get',
      url: 'https://api.spotify.com/v1/me',
      headers: { 
        'Authorization': [token_type, access_token].join(' '),
      },
      json: true
		};
		const userRes = await axios(userOptions);

		const id = userRes.data.id;
		res.redirect('/' + id);

	} catch (err) {

		console.log(err);

		res.send({
			message: 'Something went wrong :('
		})
	}

});

router.get('/search', (req, res) => {
	const username = req.query.username;
	res.send({
		message: 'It worked!',
		username: username
	});
})

router.get('/:id', (req, res) => {
	const id = req.params.id;
	res.send({
		message: 'It worked!',
		id: id
	})
});


module.exports = router;