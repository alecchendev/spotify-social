import styles from '../styles/feed.module.css';
import { Text, Toggle } from '.';

export default function Feed({ feed }) {
	return (
		<div>

			{
				!(feed && feed.length !== 0)
				?
				<Text>
					You don't currently follow anyone.
				</Text>
				:
				<div>
					
				</div>
			}

		</div>
	);
}