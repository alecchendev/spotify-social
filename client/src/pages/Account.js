import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getQueryParams } from '../lib/utils.js';
import Button from '../components/button.js';
import Heading from '../components/heading.js';
import Kicker from '../components/kicker.js';

export default function Account() {

	const { id } = useParams();
	const { jwtToken } = getQueryParams();

	React.useEffect(() => {

	}, []);


	return (
		<div>
			<Kicker>Account</Kicker>
			<Heading>Preferences/Feed</Heading>
			{id}
			{jwtToken}
			<br/>
			<Link to={'/' + id}><Button>View Profile</Button></Link>
		</div>
	)
}