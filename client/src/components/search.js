import styles from '../styles/search.module.css';
import { TextInput } from '.';

export default function Search({ search }) {

	return (
			<TextInput
				className={styles.searchInput}
				type='text' placeholder='Username'
				onChange={(event) => search(event.target.value)}
			/>
	);
}