

import styles from '../styles/user.module.css';
import { Text } from '.';

export default function User({ item }) {
	return (<div className={styles.user}>
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
					<Text>{item.display_name}</Text>
				</div>
				:
				<Text>Uhh tbh idk what's happening here.</Text>
			}
		</div>

	</div>);
}