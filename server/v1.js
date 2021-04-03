require('dotenv').config({ path: require('find-config')('.env') });
const { generateRandomString } = require('./utils');
const { generateAccessToken } = require('./jwt');
const { getAuth, getUser, getArtists, getTracks, getCurrent, getRecent } = require('./spotify');
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

	try {

		const authRes = await getAuth(clientId, clientSecret, 'authorization_code', code, redirectUri);

		const { access_token, token_type, refresh_token } = authRes.data;

		const userRes = await getUser(token_type, access_token);

		const id = userRes.data.id;

		const query = `insert into users (user_id, refresh_token) values ($1, $2)
									ON CONFLICT (user_id) DO UPDATE SET refresh_token = EXCLUDED.refresh_token;`;

		const queryRes = await client.query(query, [ id, refresh_token ]);
		console.log('Created user: ' + id);

		const jwtToken = generateAccessToken(id);

		res.redirect(frontendUrl + '/account/' + id + '?' +
			querystring.stringify({
				jwtToken: jwtToken
			})
		);

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
	try {
		const queryRes = await client.query(query, [ id ]);

		if (queryRes.rows.length === 0) {
			res.send({
				message: 'Couldn\'t get refresh token.'
			});
		}

		const refreshToken = queryRes.rows[0].refresh_token;

		const accessRes = await getAuth(clientId, clientSecret, 'refresh_token', '', '', refreshToken);
		const { access_token, token_type } = accessRes.data;	

		// Retrieve data from Spotify API
		const userRes = await getUser(token_type, access_token);
		const artistRes = await getArtists(token_type, access_token, 'medium_term', 20);
		const trackRes = await getTracks(token_type, access_token, 'short_term', 20);
		const currentRes = await getCurrent(token_type, access_token);
		const recentRes = await getRecent(token_type, access_token);

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