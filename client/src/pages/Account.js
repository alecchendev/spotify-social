import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFeedData } from '../lib/api.js';
import styles from '../styles/account.module.css';
import { Text, Button, Heading, Kicker, Toggle } from '../components';

export default function Account() {

	const [ feedData, setFeedData ] = React.useState({});
	const [ tab, setTab ] = React.useState('feed'); // feed, preferences
	const [ privateMode, setPrivateMode ] = React.useState(false);

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

		// get and set private

	}, []);

	const switchTab = (newTab) => {
		setTab(newTab);
	};

	const changePrivate = () => {
		console.log('Called changePrivate.');

	}

	const deleteAccount = (id) => {
		console.log('Called deleteAccount.');
	}


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
			<div className={styles.sectionBox}>
			{
				(tab === 'feed' && tab !== 'preferences')
				?
				<div>

				</div>
				:
				<div>
					<div className={styles.settingBox}>
						<div className={styles.settingText}>
							<Text className={styles.settingHead}>Private Mode</Text>
							<Text>Toggle this on to make your profile only visible to you.</Text>
						</div>
						
						<div className={styles.vertAlign}>
							<Toggle checked={privateMode} handleChange={() => changePrivate()}/>
						</div>
					</div>

					<div className={styles.settingBox}>
						<div className={styles.settingText}>
							<Text className={styles.settingHead}>Delete Account</Text>
							<Text>
								Click this button to revoke this app's permissions on your Spotify account.
							</Text>
						</div>
						
						<div className={styles.vertAlign}>
							<button className={styles.deleteButton} onClick={() => deleteAccount(id)}> Delete Account</button>
						</div>
					</div>

				</div>
			}
			</div>

		</div>
	)
}