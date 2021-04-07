import React from 'react';
// import { Link, useParams } from 'react-router-dom';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAccountData, changePrivateMode, getPrivateMode, getFollowing, getOtherUser, getFeedUser } from '../../lib/api.js';
import styles from '../../styles/account.module.css';
import utilStyles from '../../styles/utils.module.css';
import { Layout, Text, Button, Heading, Kicker, Feed, Settings } from '../../components';

// const url = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
const url = process.env.NODE_ENV === 'production' ? 'https://morning-oasis-60015.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATE

export default function Account() {

	const [ accountData, setAccountData ] = React.useState({});

	const [ following, setFollowing ] = React.useState(''); // Pre fetched state
	const [ tab, setTab ] = React.useState('feed'); // feed, preferences
	const [ privateMode, setPrivateMode ] = React.useState(false);

	const router = useRouter();
	// const { id } = router.query;
	const [ id, setId ] = React.useState('');
	// const { id } = useParams();

	React.useEffect(() => {

		setId(router.query.id);

		let id = router.query.id;

		const callApi = async (id) => {

			try {
				const accountRes = await getAccountData(id);
				setAccountData({
					status: 200,
					...accountRes.data
				});

				const followingRes = await getFollowing(); // returns array
				const followingData = [];
				for (const otherId of followingRes.data.following) {
					const userRes = await getOtherUser(otherId, id);
					if (userRes.data.private === false) {
						const userData = {
							...userRes.data.user,
							current: userRes.data.current,
							recent: userRes.data.recent
						};
						followingData.push(userData);
					}
				}
				setFollowing(followingData);

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


	}, [router]);

	const switchTab = (newTab) => {
		setTab(newTab);
	};

	const updatePrivate = async (id) => {
		await changePrivateMode(id);
		const privateRes = await getPrivateMode(id);
		setPrivateMode(privateRes.data.private);
	}

	return (
		<Layout>
		<div>
			{
				!(accountData &&
				Object.keys(accountData).length !== 0)
				?
				<Text className={styles.topBox}>Loading...</Text>
				:
				<>
				
				{
					accountData.status === 200
					?
					<>
						<div className={styles.topBox}>
							<Kicker>Account</Kicker>
							<div className={styles.headingBox}>
								<Heading className={styles.heading}>{tab}</Heading>
								<div className={styles.vertAlign}>
									<Link href={'/' + id}><Button className={utilStyles.btnGreen}>View Profile →</Button></Link>
								</div>
							</div>
							<div className={styles.tabBox}>
								<Button className={styles.tabButton + ' ' + (tab === 'feed' ? styles.tabButtonTrue : styles.tabButtonFalse)} onClick={() => switchTab('feed')}>Feed</Button>
								<Button className={styles.tabButton + ' ' + (tab === 'settings' ? styles.tabButtonTrue : styles.tabButtonFalse)} onClick={() => switchTab('settings')}>Settings</Button>
							</div>
						</div>

						<div className={styles.sectionBox}>
						{
							(tab === 'feed' && tab !== 'settings')
							?
							<Feed feed={following} />
							:
							<Settings handleChange={() => updatePrivate(id)} privateMode={privateMode} url={url + '/' + API_VERSION + '/account/delete/' + id}/>
						}
						</div>
					</>
					:
					<div className={styles.topBox}>
						<Kicker>Account</Kicker>
						<div className={styles.headingBox}>
							<Heading className={styles.heading}>User Not Found.</Heading>
							<div className={styles.vertAlign}>
								<a href={url + '/' + API_VERSION + '/login'}><Button className={utilStyles.btnGreen}>Login</Button></a>
							</div>
						</div>	
					</div>
				}
				</>
			}
			

		</div>
		</Layout>
	)
}