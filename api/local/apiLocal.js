const app = require('..');

const port = process.env.PORT || 5000 || '0.0.0.0';
app.listen(port);

console.log(`spotify-social listening on ${port}`);