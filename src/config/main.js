require('dotenv').config();

module.exports = {

  // Database URLs
  DATABASE_URL: process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/heart-strong',
  TEST_DATABASE_URL: global.TEST_DATABASE_URL || 'mongodb://localhost/test-heart-strong',

  // Server listen port
  PORT: process.env.PORT || 8080,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'testing',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
};
