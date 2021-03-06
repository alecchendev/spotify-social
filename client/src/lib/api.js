import axios from 'axios';
import querystring from 'querystring';

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATER

export async function checkJWTAuth() {

	const options = {
		method: 'get',
		url: url + '/' + API_VERSION + '/jwtAuth',
		withCredentials: true,
		json: true
	};
	return await axios(options);

}

export async function getReccommendations() {
	const options = {
		method: 'get',
		url: url + '/' + API_VERSION + '/reccommendations',
		withCredentials: true,
		json: true
	};
	return await axios(options);
}

export async function getFollowing() {

	const options = {
		method: 'get',
		url: url + '/' + API_VERSION + '/follow',
		withCredentials: true,
		json: true
	};
	return await axios(options);

}

export async function getOtherUser(id, myId) {

	const options = {
		method: 'get',
		data: {
			myId: myId
		},
		url: url + '/' + API_VERSION + '/other/' + id + '?myId=' + myId,
		json: true
	}
	return await axios(options);

}

export async function unfollowUser(id) {

	const options = {
		method: 'delete',
		url: url + '/' + API_VERSION + '/follow/' + id,
		withCredentials: true,
		json: true
	};
	return await axios(options);

}

export async function followUser(id) {

	const options = {
		method: 'post',
		url: url + '/' + API_VERSION + '/follow/' + id,
		withCredentials: true,
		json: true
	};
	return await axios(options);

}

export async function getIsFollowing(id) {

	const options = {
		method: 'get',
		url: url + '/' + API_VERSION + '/follow/' + id,
		withCredentials: true,
		json: true
	};
	return await axios(options);

}

export async function changePrivateMode(id) {
	console.log('Called changePrivateMode');

	const options = {
		method: 'put',
		url: url + '/' + API_VERSION + '/account/private/' + id,
		withCredentials: true,
		json: true
	};

	return await axios(options);

}

export async function getAccountData(id) {
	console.log('Called getAccountData');

	const options = {
		method: 'get',
		url: url + '/' + API_VERSION + '/account/' + id,
		withCredentials: true,
		json: true
	};

	return await axios(options);

}

export async function getPrivateMode(id) {
	console.log('Called getPrivateMode');

	const options = {
		method: 'get',
		url: url + '/' + API_VERSION + '/account/private/' + id,
		json: true
	};

	return await axios(options);

}

export async function getSearchResults(queryParams) {
	console.log('Called getSearchResults');
	return await axios.get(url + '/' + API_VERSION + '/search?' + querystring.stringify(queryParams));

}

export async function getProfileData(id) {
	console.log('Called getProfileData');
	return await axios.get(url + '/' + API_VERSION + '/' + id);
}