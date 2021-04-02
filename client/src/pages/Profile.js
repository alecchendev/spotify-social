import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProfileData } from '../lib/api.js';
import Button from '../components/button.js';
import Heading from '../components/heading.js';

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
			<Heading>Profile</Heading>
			{JSON.stringify(profileData)}
			<br/>
			<Link to='/'><Button>Home</Button></Link>
		</div>
	)
}