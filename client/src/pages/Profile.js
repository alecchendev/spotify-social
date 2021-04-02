import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProfileData } from '../lib/api.js';

export default function Profile() {

	const [ profileData, setProfileData ] = React.useState({});

	const { id } = useParams();

	React.useEffect(() => {

		const callApi = async (id) => {
			
			try {
				const profileRes = await getProfileData(id);
				setProfileData(profileRes.data);
			} catch (err) {
				console.log(err);
			}

		}

		callApi(id);

	}, []);


	return (
		<div>
			<h1>Profile component.</h1>
			{JSON.stringify(profileData)}
			<Link to='/'><button>Home</button></Link>
		</div>
	)
}