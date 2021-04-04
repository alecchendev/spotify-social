require('dotenv').config({ path: require('find-config')('.env') });
const { generateRandomString } = require('./utils');
const { generateAccessToken, authenticateToken } = require('./jwt');
const { getAuth, getUser, getArtists, getTracks, getCurrent, getRecent } = require('./spotify');
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

// Get all people the user is following
router.get('/', authenticateToken, async (req, res) => {

	const id = req.data.id;

	const query = `select following_id from following where user_id = $1;`;

	try {
		const queryRes = await client.query(query, [ id ]);
		console.log('Got following for user: ' + id);

		res.send({
			following: queryRes.rows.map(row => { return row.following_id })
		});

	} catch (err) {

		console.log(err);
		res.send({
			message: 'Couldn\'t get following for some reason.'
		})

	}

})

// Get if the user follows this person
router.get('/:followingId', authenticateToken, async (req, res) => {

	const id = req.data.id; // cookie
	const followingId = req.params.followingId;

	const query = `select following_id from following where user_id = $1 and following_id = $2;`;

	try {
		const queryRes = await client.query(query, [ id, followingId ]);
		console.log('Got isFollowing for user: ' + id);

		res.send({
			isFollowing: queryRes.rows.length !== 0
		});

	} catch (err) {

		console.log(err);
		res.send({
			message: 'Couldn\'t get for some reason.'
		})

	}

})

// Have the user follow this person

// Have the user unfollow this person


module.exports = router;