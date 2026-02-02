const jwt = require('jsonwebtoken');

// Generate access token
const generateToken = (userId, email, roleId, organisationId) => {
  return jwt.sign(
    {
      userId,
      email,
      roleId,
      organisationId,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Expires in 24 hours
    },
    process.env.JWT_SECRET || 'secret_key'
  );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // Expires in 7 days
    },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret'
  );
};

module.exports = {
  generateToken,
  generateRefreshToken
};