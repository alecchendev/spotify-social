
import styles from '../styles/artist.module.css';
import { Text } from '.';

export default function Artist({ item }) {
	return (<div className={styles.artist}>
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
					<Text>{item.name}</Text>
				</div>
				:
				<Text>Playing advertisment... refresh in a little.</Text>
			}
		</div>

	</div>);
}