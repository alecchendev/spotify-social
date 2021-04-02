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

		const query = `insert into users (user_id, refresh_token) values ($1, $2) ON CONFLICT DO NOTHING;`;
		client.query(query, [ id, refresh_token ], (err, resq) => {
			if (err) throw err;
			console.log('Created user: ' + id);
		});

		res.redirect('/' + id);

	} catch (err) {

		console.log(err);

		res.send({
			message: 'Something went wrong :('
		})
	}

});

router.get('/search', async (req, res) => {
	const username = req.query.username;
	console.log(username);

	try {
		const authRes = await axios({
			method: 'post',
			url: 'https://accounts.spotify.com/api/token',
			params: {
				grant_type: 'client_credentials'
			},
			headers: { 
				'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')),
				'Content-Type': 'application/x-www-form-urlencoded' 
			},
			json: true
		});

		const { access_token, token_type } = authRes.data;
		const searchRes = await axios({
			method: 'get',
			url: 'https://api.spotify.com/v1/search',
			params: {
				q: username,
				type: 'playlist'
			},
			headers: {
				'Authorization': [token_type, access_token].join(' ')
			}
		})
		res.send(searchRes.data);

	} catch (err) {
		console.log(err);
		res.send({
			message: 'Couldn\'t get token.'
		})
	}

})

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const query = `select refresh_token from users where user_id = $1`;
	let refreshToken = '';
	client.query(query, [ id ], async (err, resq) => {
		if (err) throw err;
		console.log(resq.rows[0].refresh_token);
		refreshToken = resq.rows[0].refresh_token;

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
	
		try {
			const accessRes = await axios(authOptions);
			const { access_token, token_type } = accessRes.data;	
			const userOptions = {
				method: 'get',
				url: 'https://api.spotify.com/v1/me',
				headers: { 
					'Authorization': [token_type, access_token].join(' '),
				},
				json: true
			};
			const userRes = await axios(userOptions);
			res.send({
				data: userRes.data
			});
	
	
		} catch (err) {
			console.log(err);
			res.send({
				message: 'Spotify API request didn\'t work'
			})
		}
	});
	

});


module.exports = router;