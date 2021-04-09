import styles from '../styles/searchResults.module.css';
import { Text, Subtext } from '.';
import { Link } from 'react-router-dom';

export default function SearchResults({ searchResults }) {

	const limit = 5;

	return (
		<div>
			{searchResults.slice(0, limit).map(item => {
				return (
					<div className={styles.searchResult}>
						<Link className={styles.searchLink} to={'/' + item.user_id}><Text>{item.display_name}</Text></Link>
						<Subtext>{item.user_id}</Subtext>
					</div>
				)
			})}
		</div>
	)
}