require('dotenv').config({ path: require('find-config')('.env') });
const { generateRandomString } = require('./utils');
const querystring = require('querystring');
const express = require('express');
const router = express.Router();

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const redirectUri = [url, process.env.API_VERSION, 'callback'].join('/');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = [
	'user-top-read'
].join(' ');
const stateKey = 'spotify_auth_state';


router.get('/login', (req, res) => {

	const state = generateRandomString(16);
	res.cookie(stateKey, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    })
	);

});

router.get('/callback', (req, res) => {
	res.send({
		message: 'Callback worked!'
	})

});


router.get('/:uri', (req, res) => {
	res.send({
		message: 'It worked!'
	})
});

module.exports = router;