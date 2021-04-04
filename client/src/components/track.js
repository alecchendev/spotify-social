import React from 'react';
import styles from '../styles/track.module.css';
import { Text, Subtext } from '.';

export default function Track({ item }) {

	const [ playing, setPlaying ] = React.useState(false);

	const playPause = () => {
		console.log(playing);
		if (item.preview_url) {
			if (playing) {
				document.getElementById(item.preview_url).pause();
				setPlaying(false);
			} else {
				document.getElementById(item.preview_url).play();
				setPlaying(true);
			}
		}
	}

	return (<div className={styles.track}>
		<div className={styles.albumBox}>
		{
			item && item.album.images.length > 0 &&
			<img className={styles.albumImg} alt='Currently playing album cover' src={item.album.images[0].url}/>
		}
		</div>

		<div className={styles.infoBox}>
			{
				item
				?
				<div>
					<span className={item.preview_url && styles.songTitle}><Text onClick={() => playPause()}>{item.name}</Text></span>
					<Subtext>{item.artists.map(artist => artist.name).join(', ')}</Subtext>
					<audio id={item.preview_url} className={styles.player} src={item.preview_url} controls></audio>
				</div>
				:
				<Text>Playing advertisment... refresh in a little.</Text>
			}
		</div>

	</div>);
}