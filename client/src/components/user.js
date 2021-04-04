

import styles from '../styles/user.module.css';
import { Text, Subtext, Kicker, Track } from '.';
import { Link } from 'react-router-dom';

export default function User({ item }) {

	const nowItem = item.current === '' ? item.recent.items[0].track : item.current.item;
	const recentLimit = 5;

	return (<div className={styles.user}>
		<div className={styles.userInfo}>

			<div className={styles.imgBox}>
			{
				item && item.images.length > 0 &&
				<img className={styles.profileImg} alt='Currently playing album cover' src={item.images[0].url}/>
			}
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

			<Text>{nowItem.name}</Text>
			<Subtext>{nowItem.artists && nowItem.artists.map(artist => artist.name).join(', ')}</Subtext>

		</div>

		<div className={styles.recentBox}>
			<div className={styles.recentLabel}>
				<Kicker>Recently Played</Kicker>
			</div>
			<div className={styles.recentContent}>
				{
					item.recent.items.slice(0, recentLimit).map(item => {
						return (
							<div className={styles.recentArtistImgBox + ' ' + styles.recentItem}>
								<img className={styles.recentImg} alt="Recent album cover" src={item.track.album.images[0].url}/>
							</div>
						);
					})
				}
			</div>
		</div>

	</div>);
}