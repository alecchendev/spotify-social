import styles from '../styles/explore.module.css';
import utilStyles from '../styles/utils.module.css';
import { Button, Text, Toggle, UserAlt, TextInput, Search } from '.';
import { Link } from 'react-router-dom';
import Kicker from './kicker';
import React from 'react';

export default function Explore({ reccs, searchResults, follow }) {

	const reccLimit = 8;

	const [ search, setSearch ] = React.useState('');

	const handleSearch = (searchText) => {
		setSearch(searchText);
	}

	return (
		<div>

			<div className={styles.searchBox}>
				<div className={styles.searchInput} >
					<Search className={styles.searchInput} search={handleSearch} />
				</div>
				<div className={styles.searchBtnBox + ' ' + styles.vertAlign}>
					<Link to={'/' + search}><Button className={utilStyles.btnGreen}>Search</Button></Link>
				</div>
			</div>

			<div className={styles.contentBox}>
			{
				(searchResults && Object.keys(searchResults).length !== 0)
				?
				<div className={styles.search}>
				
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