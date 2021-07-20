import styles from '../styles/userAlt.module.css';
import utilStyles from '../styles/utils.module.css';
import { Text, Subtext, Kicker, Button } from '.';
import { Link } from 'react-router-dom';
import { getIsFollowing, unfollowUser, followUser } from '../lib/api';
import React from 'react';

export default function User({ item, follow }) {

	const nowItem = item.current === '' ? (item.recent.items.length > 0 ? item.recent.items[0].track : null) : item.current.item;
	const nowArtists = nowItem.artists ? nowItem.artists.map(artist => artist.name).join(', ') : '';

	const [ following, setFollowing ] = React.useState(false);

	const handleClick = () => {
		const updateFollowing = async () => {
			try {
				if (following) {
					await unfollowUser(item.id);
				} else {
					await followUser(item.id);
				}
				const followingRes = await getIsFollowing(item.id);
				setFollowing(followingRes.data.isFollowing);
			} catch (err) {
				console.log(err);
			}
		}
		updateFollowing();
	}

	return (<div className={styles.user}>
		<div className={styles.userInfo}>
			<div className={styles.vertAlign}>
				<div className={styles.imgBox}>
				{
					item && item.images.length > 0 &&
					<img className={styles.profileImg} alt='Currently playing album cover' src={item.images[0].url}/>
				}
				</div>

			</div>
			
			<div className={styles.infoBox}>
				{
					item
					?
					<div>
						<Link className={styles.userLink} to={'/' + item.id}><Text>{item.display_name}</Text></Link>
					</div>
					:
					<Text>Uhh tbh idk what's happening here.</Text>
				}
			</div>

			<div className={styles.followBox}>
				<Button className={styles.thinFollowBtn + ' ' + (following ? utilStyles.btnBlackOutlined : utilStyles.btnGreen)} onClick={handleClick}>{following ? 'Following' : 'Follow'}</Button>
			</div>
			
			<div className={styles.nowBox} >

				<div className={styles.nowLabel}>

					{
						item.current !== ''
						?
						<Kicker>Currently Playing</Kicker>
						:
						<Kicker>Last Played</Kicker>
						// <Text>Not playing anything atm.</Text>
					}

				</div>

				<Text className={styles.nowName}>{nowItem.name && (nowItem.name.length <= 20 ? nowItem.name : nowItem.name.slice(0, 17) + '...')}</Text>
				<Subtext className={styles.nowArtist}>{nowArtists.length <= 23 ? nowArtists : nowArtists.slice(0, 20) + '...'}</Subtext>

			</div>

		</div>

	</div>);
}