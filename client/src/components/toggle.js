import styles from '../styles/toggle.module.css';

export default function Toggle({ checked, handleChange }) {
	return (
		<label className={styles.switch}>
			<input type="checkbox" checked={checked} onChange={handleChange}/>
			<span className={styles.slider + ' ' + styles.round}></span>
		</label>
	);
}