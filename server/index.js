const express = require('express');
const cors = require('cors');
const path = require('path');
const api = require('./v1');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/v1', api);

const port = process.env.PORT || 5000 || '0.0.0.0';
app.listen(port);

console.log(`spotify-social listening on ${port}`);