require('dotenv').config({ path: require('find-config')('.env') });
const { generateRandomString } = require('./utils');
const querystring = require('querystring');
const axios = require('axios');
const express = require('express');
const router = express.Router();

// DB
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:3000';
const redirectUri = [url, process.env.API_VERSION, 'callback'].join('/');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = [
	'user-top-read',
	'user-read-currently-playing',
	'user-read-recently-played'
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

		const query = `insert into users (user_id, refresh_token) values ($1, $2)
									ON CONFLICT (user_id) DO UPDATE SET refresh_token = EXCLUDED.refresh_token;`;

		const queryRes = await client.query(query, [ id, refresh_token ]);
		console.log('Created user: ' + id);

		res.redirect(frontendUrl + '/' + id);

	} catch (err) {

		console.log(err);

		res.send({
			message: 'Something went wrong :('
		})
	}

});

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const query = `select refresh_token from users where user_id = $1`;
	let refreshToken = '';
	try {
		const queryRes = await client.query(query, [ id ]);

		if (queryRes.rows.length > 0) {
			refreshToken = queryRes.rows[0].refresh_token;
		}

		if (refreshToken === '') {
			res.send({
				message: 'Couldn\'t get refresh token.'
			});
		}

		var authOptions = {
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			headers: { 'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')) },
			params: {
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			},
			json: true
		};

		const accessRes = await axios(authOptions);
		const { access_token, token_type } = accessRes.data;	

		// Get user
		const userOptions = {
			method: 'get',
			url: 'https://api.spotify.com/v1/me',
			headers: { 
				'Authorization': [token_type, access_token].join(' '),
			},
			json: true
		};
		const userRes = await axios(userOptions);

		const artistOptions = {
			method: 'get',
			url: 'https://api.spotify.com/v1/me/top/artists',
			params: {
				time_range: 'medium_term'
			},
			headers: { 
				'Authorization': [token_type, access_token].join(' '),
			},
			json: true
		};
		const artistRes = await axios(artistOptions);


		const trackOptions = {
			method: 'get',
			url: 'https://api.spotify.com/v1/me/top/tracks',
			params: {
				time_range: 'short_term'
			},
			headers: { 
				'Authorization': [token_type, access_token].join(' '),
			},
			json: true
		};
		const trackRes = await axios(trackOptions);

		const currentOptions = {
			method: 'get',
			url: 'https://api.spotify.com/v1/me/player/currently-playing',
			params: {
				market: 'from_token'
			},
			headers: { 
				'Authorization': [token_type, access_token].join(' '),
			},
			json: true
		};
		const currentRes = await axios(currentOptions);


		const recentOptions = {
			method: 'get',
			url: 'https://api.spotify.com/v1/me/player/recently-played',
			headers: { 
				'Authorization': [token_type, access_token].join(' '),
			},
			json: true
		};
		const recentRes = await axios(recentOptions);

		res.send({
			user: userRes.data,
			artists: artistRes.data,
			tracks: trackRes.data,
			current: currentRes.data,
			recent: recentRes.data
		});

	} catch (err) {
		console.log(err);
		res.send({
			message: 'Something went wrong :('
		});
	}
	

});


module.exports = router;