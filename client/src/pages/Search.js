import React from 'react';
import { Link } from 'react-router-dom';
import { getSearchResults } from '../lib/api.js';
import { getQueryParams } from '../lib/utils.js';


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
			<h1>Search component.</h1>
			{JSON.stringify(searchResults)}
			<Link to='/'><button>Home</button></Link>
		</div>
	)
}