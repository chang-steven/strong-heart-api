const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { User } = require('../models/user');
const config = require('./main');

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.JWT_SECRET;
  passport.use(new JwtStrategy(opts,
    (payload, done) => {
        done(null, payload.user);
      }
    )
  )


  //    function(jwt_payload, done) {
  //   User.findOne({_id: jwt_payload._id})
  //   .then((result) => {
  //     if (result) {
  //       return done(null, result)
  //     } else {
  //       done(null, false);
  //     }
  //   })
  //   .catch( err => {
  //     console.error('Ooops');
  //     throw err
  //   })
  // }))
};
