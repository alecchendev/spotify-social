import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { checkJWTAuth, getProfileData, getIsFollowing, followUser, unfollowUser } from '../lib/api.js';
import Button from '../components/button.js';
import Heading from '../components/heading.js';
import Kicker from '../components/kicker.js';
import styles from '../styles/profile.module.css';
import utilStyles from '../styles/utils.module.css';
import { Track, Artist, Text } from '../components';

export default function Profile() {

	const [ profileData, setProfileData ] = React.useState({});
	const [ auth, setAuth ] = React.useState(false);
	const [ following, setFollowing ] = React.useState(false);

	const { id } = useParams();

	const checkIsFollowing = async (id) => {
			
		try {
			const followingRes = await getIsFollowing(id);
			setFollowing(followingRes.data.isFollowing);
		} catch (err) {
			console.log(err);
		}
	}

	React.useEffect(() => {

		const callApi = async (id) => {
			
			try {
				const profileRes = await getProfileData(id);
				setProfileData(profileRes.data);
			} catch (err) {
				console.log(err);
			}

		}

		callApi(id);

		const checkAuth = async () => {

			try {
				const authRes = await checkJWTAuth();
				setAuth(true);
			} catch (err) {
				console.log(err);
			}
		}

		checkAuth();

		

		checkIsFollowing(id);

	}, []);

	const handleFollow = async () => {
		await followUser(id);
		await checkIsFollowing(id);
	}

	const handleUnfollow = async () => {
		await unfollowUser(id);
		await checkIsFollowing(id);
	}


	return (
		<div>
			{
				
			}
			{
				(profileData
				&& Object.keys(profileData).length !== 0)
				?
				<div>
					<div className={styles.header}>
						<div className={styles.imgBox}>
							{profileData.user.images.length > 0 &&
							<img className={styles.profileImg} alt='Profile image' src={profileData.user.images[0].url}/>
							}
						</div>

						<div className={styles.headerBox}>
							<Kicker>Profile</Kicker>
							<Heading>{profileData.user.display_name}</Heading>
							<Text>{profileData.user.followers.total} Followers</Text>
							{
								auth &&
								(
									following === false
									?
									<Button className={styles.followButton + ' ' + utilStyles.btnGreen} onClick={handleFollow}>Follow</Button>
									:
									<Button className={styles.followButton + ' ' + utilStyles.btnBlackOutlined} onClick={handleUnfollow}>Following</Button>
								)
							}
						</div>

					</div>

					<div className={styles.current}>
						{
							profileData.current !== ''
							?
							<Kicker>Currently Playing</Kicker>
							:
							<Kicker>Last Played</Kicker>
							// <Text>Not playing anything atm.</Text>
						}
						<div className={styles.currentContent}>
							{
								profileData.current !== ''
								?
								<Track item={profileData.current.item} />
								:
								<Track item={profileData.recent.items[0].track}/>
								// <Text>Not playing anything atm.</Text>
							}
						</div>
					</div>

					<div className={styles.top}>

						<div className={styles.topSection}>
							<Kicker>Top Tracks</Kicker>
							{profileData.tracks.items.map(track => {
								return (
									<div className={styles.item}>
										<Track item={track}/>
									</div>
								);
							})}
						</div>

						<div className={styles.topSection}>
							<Kicker>Top Artists</Kicker>
							{profileData.artists.items.map(artist => {
								return (
									<div className={styles.item}>
									<Artist item={artist}/>
									</div>
									);
								})}
						</div>

					</div>
				</div>
				:
				<div>
					Loading...
				</div>
			}

			<div className={styles.buttonBox}>
				<Link to='/'><Button className={utilStyles.btnGreen}>Home</Button></Link>
				{
					auth &&
					<Link to={'/account/' + id}><Button className={utilStyles.btnGreen}>Account</Button></Link>
				}
			</div>
		</div>
	)
}