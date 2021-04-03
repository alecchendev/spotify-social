import styles from '../styles/feed.module.css';
import { Text, Toggle } from '.';

export default function Feed({ feed }) {
	return (
		<div>

			{
				!(feed && feed.length !== 0)
				?
				<Text>
					You either don't follow anyone on Spotify, or something's wrong on the backend temporarily.
				</Text>
				:
				<div>
					
				</div>
			}

		</div>
	);
}