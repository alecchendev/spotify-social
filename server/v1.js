require('dotenv').config({ path: require('find-config')('.env') });
const { generateRandomString } = require('./utils');
const { generateAccessToken, authenticateToken } = require('./jwt');
const { getAuth, getUser, getArtists, getTracks, getCurrent, getRecent, getOtherUser } = require('./spotify');
const querystring = require('querystring');
const axios = require('axios');
const followApi = require('./follow');
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

// Constants
const url = process.env.NODE_ENV === 'production' ? 'https://morning-oasis-60015.herokuapp.com' : 'http://localhost:5000';
const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://spotify-social-cnqpqyyxc-alecchendev.vercel.app' : 'http://localhost:3000';
const redirectUri = [url, process.env.API_VERSION, 'callback'].join('/');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = [
	'user-top-read',
	'user-read-currently-playing',
	'user-read-recently-played'
].join(' ');

// Use endpoints for following
router.use('/follow', followApi);

// Login redirect
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


// Login/auth callback
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

		const jwtToken = generateAccessToken({ id: id });

		// Set httponly cookie
		// res.cookie('jwtToken', jwtToken, {
		// 	expires: new Date(Date.now() + (1000 * 60 * 30)),
		// 	httpOnly: true
		// });

		// res.send({
		// 	jwtToken,
		// 	id,
		// 	frontendUrl
		// });

		// res.redirect(frontendUrl + '/account/' + id);
		res.redirect(frontendUrl + '/api/callback?' +
			querystring.stringify({
				jwtToken: jwtToken,
				id: id
			})
		);

	} catch (err) {

		console.log(err);

		res.send({
			message: 'Something went wrong :('
		})
	}

});

// Account
router.get('/account/:id', authenticateToken, async (req, res) => {
	console.log('Called /account/:id endpoint');


	const id = req.data.id; // cookie
	if (id !== req.params.id) { // if they have auth token for different id
		res.sendStatus(403);
	} else {
		const query = `select * from users where user_id = $1;`;

		try {
			const queryRes = await client.query(query, [ id ]);
			console.log(queryRes.rows);
			if (queryRes.rows.length === 0) {
				res.sendStatus(404); // If id doesn't exist in table
			}

			


			res.send(queryRes.rows[0]);

		} catch (err) {
			console.log(err);
			res.send({});
		}

	}
});

router.get('/account/private/:id', async (req, res) => {

	const id = req.params.id;
	const query = `select private from users where user_id = $1;`;

	try {
		const queryRes = await client.query(query, [ id ]);
		console.log('Got private mode for user: ' + id);
		if (queryRes.rows.length === 0) {
			res.sendStatus(400);
		}
		res.send({
			private: queryRes.rows[0].private
		});
	} catch (err) {
		console.log(err);
		res.send({
			message: 'Couldn\'t get private for some reason.'
		})
	}

})

router.put('/account/private/:id', authenticateToken, async (req, res) => {

	const id = req.params.id;
	const query = `update users set private = not private where user_id = $1;`;

	try {
		const queryRes = await client.query(query, [ id ]);
		console.log('Updated private mode for user: ' + id);
		res.send({
			message: 'Update worked!'
		});
	} catch (err) {
		console.log(err);
		res.send({
			message: 'Couldn\'t update for some reason.'
		})
	}


});

router.get('/account/delete/:id', authenticateToken, async (req, res) => {

	const id = req.params.id;
	const usersQuery = `delete from users where user_id = $1`;
	const followingQuery = `delete from following where user_id = $1`;

	try {
		const usersQueryRes = await client.query(usersQuery, [ id ]);
		const followingQueryRes = await client.query(followingQuery, [ id ]);
		console.log('Delete user: ' + id)
		res.redirect(frontendUrl + '/?deleted=' + id);
	} catch (err) {
		console.log(err);
		res.send({
			message: 'Couldn\'t delete for some reason.'
		})
	}
});

// JWT Auth check
router.get('/jwtAuth', authenticateToken, (req, res) => {
	res.send({
		...req.data
	});
})

// Get other user profile for feed
router.get('/other/:id', async (req, res) => {

	const myId = req.query.myId;
	const id = req.params.id;

	const query = `select refresh_token, private from users where user_id = $1`

	try {
		const queryRes = await client.query(query, [ id ]);

		if (queryRes.rows.length === 0) {
			res.sendStatus(400);
		}

		const { private, refresh_token } = queryRes.rows[0];

		if (private === true && myId !== id) {
			res.send({
				private: true
			});
		} else {

			const accessRes = await getAuth(clientId, clientSecret, 'refresh_token', '', '', refresh_token);
			const { access_token, token_type } = accessRes.data;

			const userRes = await getOtherUser(token_type, access_token, id);
			const currentRes = await getCurrent(token_type, access_token);
			const recentRes = await getRecent(token_type, access_token);	

			// const accessRes = await getAuth(clientId, clientSecret, 'client_credentials');
			// const { access_token, token_type } = accessRes.data;

			res.send({
				private: false,
				user: userRes.data,
				current: currentRes.data,
				recent: recentRes.data
		});

		}

		

	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}

})

// Profile data
router.get('/:id', async (req, res) => {
	const id = req.params.id;
	const query = `select refresh_token from users where user_id = $1`;
	const followerQuery = `select count(*) from following where following_id = $1;`;
	try {
		const queryRes = await client.query(query, [ id ]);

		if (queryRes.rows.length === 0) {
			res.sendStatus(400);
		}

		const refreshToken = queryRes.rows[0].refresh_token;

		const accessRes = await getAuth(clientId, clientSecret, 'refresh_token', '', '', refreshToken);
		const { access_token, token_type } = accessRes.data;

		// Retrieve data from Spotify API
		const userRes = await getUser(token_type, access_token);

		const shortArtistRes = await getArtists(token_type, access_token, 'short_term', 20);
		const mediumArtistRes = await getArtists(token_type, access_token, 'medium_term', 20);
		const longArtistRes = await getArtists(token_type, access_token, 'long_term', 20);

		const shortTrackRes = await getTracks(token_type, access_token, 'short_term', 20);
		const mediumTrackRes = await getTracks(token_type, access_token, 'medium_term', 20);
		const longTrackRes = await getTracks(token_type, access_token, 'long_term', 20);

		const currentRes = await getCurrent(token_type, access_token);
		const recentRes = await getRecent(token_type, access_token);

		// Follower count
		const followerQueryRes = await client.query(followerQuery, [ id ]);
		const followerCount = followerQueryRes.rows[0].count;

		res.send({
			user: userRes.data,
			artists: {
				short_term: shortArtistRes.data,
				medium_term: mediumArtistRes.data,
				long_term: longArtistRes.data
			},
			tracks: {
				short_term: shortTrackRes.data,
				medium_term: mediumTrackRes.data,
				long_term: longTrackRes.data
			},
			current: currentRes.data,
			recent: recentRes.data,
			followerCount: followerCount
		});

	} catch (err) {
		console.log(err);
		res.send({
			message: 'Something went wrong :('
		});
	}
	

});


module.exports = router;