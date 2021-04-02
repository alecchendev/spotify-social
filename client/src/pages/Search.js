import React from 'react';
import { Link } from 'react-router-dom';
import { getSearchResults } from '../lib/api.js';
import { getQueryParams } from '../lib/utils.js';
import Button from '../components/button.js';
import Heading from '../components/heading.js';


export default function Search() {

	const [ searchResults, setSearchResults ] = React.useState({});

	React.useEffect(() => {

		const callApi = async (queryParams) => {

			try {
				const searchRes = await getSearchResults(queryParams);
				setSearchResults(searchRes.data);
			} catch (err) {
				console.log(err);
			}

		};
		const queryParams = getQueryParams();
		callApi(queryParams);

	}, []);

	return (
		<div>
			<Heading>Search Results</Heading>
			{JSON.stringify(searchResults)}
			<br/>
			<Link to='/'><Button>Home</Button></Link>
		</div>
	)
}