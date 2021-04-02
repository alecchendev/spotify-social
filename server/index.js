require('dotenv').config({ path: require('find-config')('.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const api = require('./' + process.env.API_VERSION);

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/' + process.env.API_VERSION, api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const port = process.env.PORT || 5000 || '0.0.0.0';
app.listen(port);

console.log(`spotify-social listening on ${port}`);