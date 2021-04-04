import styles from '../styles/settings.module.css';
import { Text, Toggle } from '.';

export default function Settings({ handleChange, url, privateMode }) {
	return (
		<div>

			<div className={styles.settingBox}>
				<div className={styles.settingText}>
					<Text className={styles.settingHead}>Private Mode</Text>
					<Text>Toggle this on to make your profile only visible to you.</Text>
				</div>
				
				<div className={styles.vertAlign}>
					<Toggle checked={privateMode} handleChange={handleChange} />
				</div>
			</div>

			<div className={styles.settingBox}>
				<div className={styles.settingText}>
					<Text className={styles.settingHead}>Delete Account</Text>
					<Text>
						Click this button to revoke this app's permissions on your Spotify account.
					</Text>
				</div>
				
				<div className={styles.vertAlign}>
					<a href={url}><button className={styles.deleteButton} >Delete Account</button></a>
				</div>
			</div>

		</div>
	);
}