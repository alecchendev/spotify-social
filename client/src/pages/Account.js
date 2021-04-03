import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFeedData } from '../lib/api.js';
import styles from '../styles/account.module.css';
import Button from '../components/button.js';
import Heading from '../components/heading.js';
import Kicker from '../components/kicker.js';

export default function Account() {

	const [ feedData, setFeedData ] = React.useState({});
	const [ tab, setTab ] = React.useState('feed'); // feed, preferences

	const { id } = useParams();

	React.useEffect(() => {

		const callApi = async (id) => {

			try {
				const feedRes = await getFeedData(id);
				setFeedData(feedRes.data);
			} catch (err) {
				console.log(err);
			}

		};

		callApi(id);

	}, []);

	const switchTab = (newTab) => {
		setTab(newTab);
	};


	return (
		<div>
			<Kicker>Account</Kicker>
			<div className={styles.headingBox}>
				<Heading className={styles.heading}>{tab}</Heading>
				<div className={styles.vertAlign}>
					<Link to={'/' + id}><Button>View Profile</Button></Link>
				</div>
			</div>
			<div className={styles.tabBox}>
				<button className={styles.tabButton + ' ' + (tab === 'feed' ? styles.tabButtonTrue : styles.tabButtonFalse)} onClick={() => switchTab('feed')}>Feed</button>
				<button className={styles.tabButton + ' ' + (tab === 'preferences' ? styles.tabButtonTrue : styles.tabButtonFalse)} onClick={() => switchTab('preferences')}>Preferences</button>
			</div>
		</div>
	)
}