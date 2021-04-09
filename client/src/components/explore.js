import styles from '../styles/explore.module.css';
import utilStyles from '../styles/utils.module.css';
import { Button, Text, Toggle, UserAlt, TextInput, Search, SearchResults } from '.';
import { getSearchResults } from '../lib/api.js';
import { Link } from 'react-router-dom';
import Kicker from './kicker';
import React from 'react';

export default function Explore({ reccs, follow }) {

	const reccLimit = 8;

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

	return (
		<div>

			<div className={styles.searchBox}>
				<div className={styles.searchInput} >
					<Search className={styles.searchInput} search={handleSearch} />
				</div>
			</div>

			<div className={styles.contentBox}>
			{
				(typeof searchResults === 'string' || searchResults instanceof String)
				?
				<Text>{searchResults}</Text>
				:
				(searchResults.length !== 0)
				?
				<div className={styles.searchResultsBox} >
					<SearchResults searchResults={searchResults} />
				</div>
				:
				<div className={styles.reccBox}>
					<Kicker>Reccomendations</Kicker>

					<div className={styles.reccContentBox}>
					{
						(reccs === '')
						?
						<Text>Loading...</Text>
						:
						(reccs && reccs.length !== 0)
						?
						reccs.slice(0, reccLimit).map(item => {
							return <div className={styles.recc}>
								<UserAlt item={item} follow={(id) => follow(id)} />
							</div>
						})
						:
						<Text>No reccomendations at this time. Sorry :(</Text>
					}
					</div>
				</div>
			}
			</div>	

		</div>
	);
}