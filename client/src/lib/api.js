import axios from 'axios';
import querystring from 'querystring';

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATER

export async function getSearchResults(queryParams) {
	console.log('Called getSearchResults');
	return await axios(url + '/' + API_VERSION + '/search?' + querystring.stringify(queryParams));

}

export async function getProfileData(id) {
	console.log('Called getProfileData');
	return await axios(url + '/' + API_VERSION + '/' + id);
}