import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/button.js';
import Heading from '../components/heading.js';
import TextInput from '../components/textInput.js';
import styles from '../styles/home.module.css';

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATER

export default function Home() {

	const [ search, setSearch ] = React.useState('');

	const handleChange = (event) => {
		setSearch(event.target.value);
	}

	return (
		<div>
			<Heading>Home component.</Heading>
			<div className={styles.inputFlex}>
				<div className={styles.searchBox}>
					<TextInput type='text' placeholder='Search' onChange={handleChange} />
					<div className={styles.vertAlign}>
						<Link to={'/search?username=' + search}><Button>Search</Button></Link>
					</div>
					<div className={styles.vertAlign}>
						<a href={url + '/' + API_VERSION + '/login'}><Button>Login</Button></a>
					</div>
				</div>
			</div>
		</div>
	)
}