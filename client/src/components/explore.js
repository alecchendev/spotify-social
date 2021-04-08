import styles from '../styles/explore.module.css';
import utilStyles from '../styles/utils.module.css';
import { Button, Text, Toggle, UserAlt, TextInput } from '.';
import { Link } from 'react-router-dom';
import Kicker from './kicker';

export default function Explore({ reccs, searchResults }) {

	const reccLimit = 8;

	return (
		<div>

			<div className={styles.searchBox}>
				<TextInput className={styles.searchInput} type='text' placeholder='Username' />
				<div className={styles.searchBtnBox + ' ' + styles.vertAlign}>
					<Button className={utilStyles.btnGreen}>Search</Button>
				</div>
			</div>

			<div className={styles.contentBox}>
			{
				(searchResults && Object.keys(searchResults).length !== 0)
				?
				<div className={styles.search}>
				
				</div>
				:
				<div className={styles.reccBox}>
					<Kicker>Reccomendations</Kicker>
					<div className={styles.reccContentBox}>
					{
						(reccs && reccs.length !== 0)
						?
						reccs.slice(0, reccLimit).map(item => {
							return <div className={styles.recc}>
								<UserAlt item={item}/>
							</div>
						})
						:
						<Text>Loading...</Text>
					}
					</div>
				</div>
			}
			</div>	

		</div>
	);
}