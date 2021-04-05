import React from 'react';
import { Link } from 'react-router-dom';
import { getQueryParams } from '../lib/utils.js';
import Button from '../components/button.js';
import Heading from '../components/heading.js';
import TextInput from '../components/textInput.js';
import Text from '../components/text.js';
import styles from '../styles/home.module.css';
import utilStyles from '../styles/utils.module.css';

// const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const url = process.env.NODE_ENV === 'production' ? 'https://spotifysocial.me' : 'http://localhost:5000';
const API_VERSION = 'api'; // TEMPORARY FIX LATER

export default function Home() {

	const [ search, setSearch ] = React.useState('');

	const handleChange = (event) => {
		setSearch(event.target.value);
	}

	const { deleted } = getQueryParams();

	return (
		<div className={styles.wrapper}>
			<Heading>Spotify Social</Heading>
			<Text className={styles.subtitle}>Search a friend's Spotify username to view their profile or login to activate your own.</Text>
			<div className={styles.searchBox}>
				<TextInput type='text' placeholder='Username' onChange={handleChange} />
				<div className={styles.vertAlign}>
					<Link to={'/' + search}><Button className={utilStyles.btnGreen}>Search</Button></Link>
				</div>
				<div className={styles.vertAlign}>
					<a href={url + '/' + API_VERSION + '/login'}><Button className={utilStyles.btnGreen}>Login</Button></a>
				</div>
			</div>
			<div className={styles.content}>
				{
					deleted
					&&
					<div>
						<Text>{'Deleted user: ' + deleted}</Text>
					</div>
				}
			</div>
		</div>
	)
}