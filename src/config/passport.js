const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const config = require('./main');

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.JWT_SECRET;
  passport.use(new JwtStrategy(
    opts,
    (payload, done) => {
      done(null, payload.user);
    },
  ));
};
