import React from 'react';
import { Link } from 'react-router-dom';
import { getQueryParams } from '../lib/utils.js';
import { Text, TextInput, Heading, Button, Search, Subtext, SearchResults } from '../components';
import styles from '../styles/home.module.css';
import utilStyles from '../styles/utils.module.css';
import { getSearchResults } from '../lib/api.js';

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATER

export default function Home() {

	const [ search, setSearch ] = React.useState('');
	const [ searchResults, setSearchResults ] = React.useState([]);

	const handleSearch = async (searchText) => {
		if (searchText === '') {
			setSearchResults([]);
		} else {
			try {
				const searchRes = await getSearchResults({ searchText });
				let searchVals = searchRes.data.searchRes;
				if (searchVals.length === 0) {
					searchVals = 'No results.';
				}
				setSearchResults(searchVals);

			} catch (err) {
				console.log(err);
				setSearchResults('Something went wrong.');
			}
		}
	}

	const { deleted } = getQueryParams();

	return (
		<div className={styles.wrapper}>
			<Heading>Spotify Social</Heading>
			<Text className={styles.subtitle}>Search a friend's Spotify username to view their profile or login to activate your own.</Text>
			<div className={styles.contentBox}>
				{/* <TextInput className={styles.searchInput} type='text' placeholder='Username' onChange={handleChange} /> */}
				<div className={styles.searchBox}>
					<Search search={handleSearch} />
					<div className={styles.contentBox2}>
					{
						(typeof searchResults === 'string' || searchResults instanceof String)
						?
						<Text className={styles.searchMessage}>{searchResults}</Text>
						:
						(searchResults.length !== 0)
						&&
						<div className={styles.searchResultsBox} >
							<SearchResults searchResults={searchResults} />
						</div>
					}
					</div>

				</div>

				<div className={styles.buttonBoxWrap}>
					<div className={styles.buttonBox}>
						<div className={styles.vertAlign}>
							<Link to={'/i0yd9nkk6k6nszblfxjr5y0qa'}><Button className={utilStyles.btnGreen}>See a profile</Button></Link>
						</div>
						<div className={styles.vertAlign}>
							<a href={url + '/' + API_VERSION + '/login'}><Button className={utilStyles.btnGreen}>Login</Button></a>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.deleted}>
				{
					deleted
					&&
					<div>
						<Text>{'Deleted user: ' + deleted}</Text>
					</div>
				}
			</div>

			<div className={styles.demo}>
				{
				(typeof searchResults !== 'string' && !(searchResults instanceof String) && searchResults.length === 0)
				&&
				<img className={styles.demoGif} src='/landingDemo.gif'/>
				}
			</div>
		</div>
	)
}