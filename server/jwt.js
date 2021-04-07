const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('find-config')('.env') });

function generateAccessToken(id) {
  return jwt.sign(id, process.env.JWT_TOKEN_SECRET, { expiresIn: 60 * 120 });
}

function authenticateToken(req, res, next) {
  console.log('Called authenticateToken');
  const token = req.cookies.jwtToken || null;
  // const token = req.header('jwtToken') || null;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, data) => {
    console.log(err)

    if (err) return res.sendStatus(403);

    req.data = data

    next()
  })
}

module.exports = { generateAccessToken, authenticateToken };