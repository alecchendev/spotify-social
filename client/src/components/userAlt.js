import styles from '../styles/userAlt.module.css';
import { Text, Subtext, Kicker  } from '.';
import { Link } from 'react-router-dom';

export default function User({ item }) {

	return (<div className={styles.user}>
		<div className={styles.userInfo}>
			<div className={styles.vertAlign}>
				<div className={styles.imgBox}>
				{/* {
					item && item.images.length > 0 &&
					// <img className={styles.profileImg} alt='Currently playing album cover' src={item.images[0].url}/>
				} */}
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

		</div>

	</div>);
}