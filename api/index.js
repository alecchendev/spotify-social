require('dotenv').config({ path: require('find-config')('.env') });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const api = require('./routes/v1');

const app = express();

const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://www.spotifysocial.me' : 'http://localhost:3000';

// app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:3000', // frontend
    'http://my-spotify-social.herokuapp.com',
    'https://www.spotifysocial.me'
  ],
  credentials: true // for cookies
}));
app.use(cookieParser());


app.use('/', (req, res) => {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send({
    message: 'It worked!'
  })
});

app.use('/v1', api);

app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname, '../client/build/index.html'));
  res.redirect(frontendUrl + req.url);
});

// app.use(express.static(path.join(__dirname, '../client/build')));

module.exports = app;