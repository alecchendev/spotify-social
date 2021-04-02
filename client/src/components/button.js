import styled from 'styled-components';

const Button = styled.button`
	color: white;
	background-color: #1DB954;
	text-transform: uppercase;
	letter-spacing: 2px;
	font-size: 0.9em;
	font-family: DM Sans;
	font-weight: 700;
	border-radius: 9999px;
	border: none;
	padding: 0.75em 2em 0.75em;
	transition: 0.25s;
	outline: none;

	:hover {
		background-color: #1fd15e;
		cursor: pointer;
	}

`;

export default Button;