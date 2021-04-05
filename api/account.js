require('dotenv').config({ path: require('find-config')('.env') });
const { authenticateToken } = require('./lib/jwt');
const express = require('express');
const router = express.App();

// DB
const { Pool } = require('pg');
const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
client.connect();

// Constants
const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://www.spotifysocial.me' : 'http://localhost:3000';

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

module.exports = router;