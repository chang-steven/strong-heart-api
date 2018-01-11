module.exports = {

  //CORS
  CLIENT_ORIGIN: 'https://heartstrong.netlify.com/',

  //Database URLs
  DATABASE_URL: process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/heart-strong',
  TEST_DATABASE_URL: global.TEST_DATABASE_URL || 'mongodb://localhost/test-munch-minder',

  //Server listen port
  PORT: process.env.PORT || 8080,
}
