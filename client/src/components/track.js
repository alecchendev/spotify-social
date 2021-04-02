import styles from '../styles/track.module.css';
import { Text, Subtext } from '.';

export default function Track({ item }) {
	return (<div className={styles.track}>
		<div className={styles.albumBox}>
		{
			item && item.album.images.length > 0 &&
			<img className={styles.albumImg} alt='Currently playing album cover' src={item.album.images[0].url}/>
		}
		</div>

		<div className={styles.infoBox}>
			{
				item
				?
				<div>
					<Text>{item.name}</Text>
					<Subtext>{item.artists.map(artist => artist.name).join(', ')}</Subtext>
				</div>
				:
				<Text>Playing advertisment... refresh in a little.</Text>
			}
		</div>

	</div>);
}