require('dotenv').config({ path: require('find-config')('.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const api = require('./' + process.env.API_VERSION);

const app = express();

app.use(cors({
  credentials: true
}));
// app.use(cors({
//   origin: [
//     'http://localhost:3000', // frontend
//     'http://my-spotify-social.herokuapp.com',
//     'https://www.spotifysocial.me'
//   ],
//   credentials: true // for cookies
// }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/' + process.env.API_VERSION, api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const port = process.env.PORT || 5000 || '0.0.0.0';
app.listen(port);

console.log(`spotify-social listening on ${port}`);