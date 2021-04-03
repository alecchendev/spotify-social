import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAccountData, changePrivateMode, getPrivateMode } from '../lib/api.js';
import styles from '../styles/account.module.css';
import { Text, Button, Heading, Kicker, Feed, Preferences } from '../components';

const url = process.env.NODE_ENV === 'production' ? 'https://my-spotify-social.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATE

export default function Account() {

	const [ accountData, setAccountData ] = React.useState({});

	const [ feedData, setFeedData ] = React.useState({});
	const [ tab, setTab ] = React.useState('feed'); // feed, preferences
	const [ privateMode, setPrivateMode ] = React.useState(false);

	const { id } = useParams();

	React.useEffect(() => {

		const callApi = async (id) => {

			try {
				const accountRes = await getAccountData(id);
				setAccountData({
					status: 200,
					...accountRes.data
				});

				const privateRes = await getPrivateMode(id);
				setPrivateMode(privateRes.data.private);

			} catch (err) {
				console.log(err);
				setAccountData({
					status: 400
				});
			}

		};

		callApi(id);


	}, []);

	const switchTab = (newTab) => {
		setTab(newTab);
	};

	const updatePrivate = async (id) => {
		await changePrivateMode(id);
		const privateRes = await getPrivateMode(id);
		setPrivateMode(privateRes.data.private);
	}

	return (
		<div>
			{
				!(accountData &&
				Object.keys(accountData).length !== 0)
				?
				<Text>Loading...</Text>
				:
				<>
				<Kicker>Account</Kicker>
				{
					accountData.status === 200
					?
					<>
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
							<Feed feed={accountData.feed} />
							:
							<Preferences handleChange={() => updatePrivate(id)} privateMode={privateMode} url={url + '/' + API_VERSION + '/account/delete/' + id}/>
						}
						</div>
					</>
					:
					<>
						<div className={styles.headingBox}>
							<Heading className={styles.heading}>User Not Found.</Heading>
							<div className={styles.vertAlign}>
								<a href={url + '/' + API_VERSION + '/login'}><Button>Login</Button></a>
							</div>
						</div>	
					</>
				}
				</>
			}
			

		</div>
	)
}