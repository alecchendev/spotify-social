import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getQueryParams } from '../lib/utils.js';
import { getFeedData } from '../lib/api.js';
import Button from '../components/button.js';
import Heading from '../components/heading.js';
import Kicker from '../components/kicker.js';

export default function Account() {

	const [ feedData, setFeedData ] = React.useState({});

	const { id } = useParams();
	const { jwtToken } = getQueryParams();

	React.useEffect(() => {

		const callApi = async (id, jwtToken) => {

			try {
				const feedRes = await getFeedData(id, jwtToken);
				setFeedData(feedRes.data);
			} catch (err) {
				console.log(err);
			}

		};

		callApi(id, jwtToken);

	}, []);


	return (
		<div>
			<Kicker>Account</Kicker>
			<Heading>Preferences/Feed</Heading>
			{JSON.stringify(feedData)}
			<br/>
			{id}
			<br/>
			{jwtToken}
			<br/>
			<Link to={'/' + id}><Button>View Profile</Button></Link>
		</div>
	)
}