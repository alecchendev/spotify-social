import styles from '../styles/userAlt.module.css';
import { Text, Subtext, Kicker  } from '.';
import { Link } from 'react-router-dom';

export default function User({ item }) {

	const nowItem = item.current === '' ? item.recent.items[0].track : item.current.item;

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

				<Text className={styles.nowName}>{nowItem.name}</Text>
				<Subtext className={styles.nowArtist}>{nowItem.artists && nowItem.artists.map(artist => artist.name).join(', ')}</Subtext>

			</div>

		</div>

	</div>);
}