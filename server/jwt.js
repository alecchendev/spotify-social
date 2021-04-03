const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('find-config')('.env') });

function generateAccessToken(id) {
  return jwt.sign(id, process.env.JWT_TOKEN_SECRET, { expiresIn: 60 * 60 });
}

function authenticateToken(req, res, next) {
  console.log('Called authenticateToken');
  const token = req.cookies.jwtToken || null;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403);

    req.user = user

    next()
  })
}

module.exports = { generateAccessToken, authenticateToken };