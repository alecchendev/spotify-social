const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('find-config')('.env') });

function generateAccessToken(id) {
  return jwt.sign({ data: id }, process.env.JWT_TOKEN_SECRET, { expiresIn: 60 * 60 });
}

module.exports = { generateAccessToken };