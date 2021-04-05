require('dotenv').config({ path: require('find-config')('.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const api = require('./routes/v1');

const { generateAccessToken, authenticateToken } = require('./lib/jwt');
const { getAuth, getUser, getArtists, getTracks, getCurrent, getRecent, getOtherUser } = require('./lib/spotify');
const querystring = require('querystring');

const app = express();

// Constants
const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://www.spotifysocial.me' : 'http://localhost:3000';
const redirectUri = [url, process.env.API_VERSION, 'callback'].join('/');
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = [
	'user-top-read',
	'user-read-currently-playing',
	'user-read-recently-played'
].join(' ');

// app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:3000', // frontend
    'http://my-spotify-social.herokuapp.com',
    'https://www.spotifysocial.me'
  ],
  credentials: true // for cookies
}));
app.use(cookieParser());


app.use('/', (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send({
    message: 'It worked!'
  })
});

// app.use('/v1', api);

// Login redirect
app.get('/login', (req, res) => {

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
app.get('/callback', async (req, res) => {

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
		res.cookie('jwtToken', jwtToken, {
			expires: new Date(Date.now() + (1000 * 60 * 30)),
			httpOnly: true
		});

		res.redirect(frontendUrl + '/account/' + id);

	} catch (err) {

		console.log(err);

		res.send({
			message: 'Something went wrong :('
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

// app.use(express.static(path.join(__dirname, '../client/build')));

module.exports = app;