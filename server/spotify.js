// Personal wrapper for api requests
const axios = require('axios');

const getAuth = async (clientId, clientSecret, grant_type, code = '', redirect_uri = '', refresh_token = '') => {

	const params = {
		grant_type
	};
	if (grant_type === 'refresh_token' && refresh_token !== '') {
		params.refresh_token = refresh_token;
	} else if (grant_type === 'authorization_code' && code !== '' && redirect_uri !== '') {
		params.code = code;
		params.redirect_uri = redirect_uri;
	}

	var authOptions = {
		method: 'post',
		url: 'https://accounts.spotify.com/api/token',
		headers: { 'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')) },
		params,
		json: true
	};

	return await axios(authOptions);

}

const getOtherUser = async (token_type, access_token, otherId) => {

	const userOptions = {
		method: 'get',
		url: 'https://api.spotify.com/v1/users/' + otherId,
		headers: { 
			'Authorization': [token_type, access_token].join(' '),
		},
		json: true
	};
	return await axios(userOptions);

}

const getUser = async (token_type, access_token) => {

	const userOptions = {
		method: 'get',
		url: 'https://api.spotify.com/v1/me',
		headers: { 
			'Authorization': [token_type, access_token].join(' '),
		},
		json: true
	};
	return await axios(userOptions);

}

const getArtists = async (token_type, access_token, time_range, limit) => {

	const artistOptions = {
		method: 'get',
		url: 'https://api.spotify.com/v1/me/top/artists',
		params: {
			time_range,
			limit
		},
		headers: { 
			'Authorization': [token_type, access_token].join(' '),
		},
		json: true
	};
	return await axios(artistOptions);

}

const getTracks = async (token_type, access_token, time_range, limit) => {

	const trackOptions = {
		method: 'get',
		url: 'https://api.spotify.com/v1/me/top/tracks',
		params: {
			time_range,
			limit
		},
		headers: { 
			'Authorization': [token_type, access_token].join(' '),
		},
		json: true
	};
	return await axios(trackOptions);

}

const getCurrent = async (token_type, access_token, market = 'from_token') => {

	const currentOptions = {
		method: 'get',
		url: 'https://api.spotify.com/v1/me/player/currently-playing',
		params: {
			market
		},
		headers: { 
			'Authorization': [token_type, access_token].join(' '),
		},
		json: true
	};
	return await axios(currentOptions);

}

const getRecent = async (token_type, access_token) => {
	
	const recentOptions = {
		method: 'get',
		url: 'https://api.spotify.com/v1/me/player/recently-played',
		headers: { 
			'Authorization': [token_type, access_token].join(' '),
		},
		json: true
	};
	return await axios(recentOptions);

}

module.exports = { getAuth, getUser, getOtherUser, getArtists, getTracks, getCurrent, getRecent };
