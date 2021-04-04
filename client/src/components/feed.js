import styles from '../styles/feed.module.css';
import { Text, Toggle, User } from '.';

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
					{feed.map(item => {
						return (
							<div className={styles.userBox}>
								<User item={item} />
							</div>
						)
					})}
				</div>
			}

		</div>
	);
}