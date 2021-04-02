import React from 'react';
import { Link } from 'react-router-dom';

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATER

export default function Home() {

	const [ search, setSearch ] = React.useState('');

	const handleChange = (event) => {
		setSearch(event.target.value);
	}

	return (
		<div>
			<h1>Home component.</h1>
			<input type='text' placeholder='Search' onChange={handleChange} />
			<Link to={'/search#username=' + search}><button>Search</button></Link>
			<a href={url + '/' + API_VERSION + '/login'}><button>Login</button></a>
		</div>
	)
}