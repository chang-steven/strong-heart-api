const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main');
const { dataParser } = require('../config/utils');
const { User } = require('../models/user');

const userRouter = express.Router();

userRouter.use(passport.initialize());
require('../config/passport')(passport);

const jwtAuth = passport.authenticate('jwt', { session: false });

const createAuthToken = user => jwt.sign(
  user,
  config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256',
  },
);

// New user registration
userRouter.post('/signup', (req, res) => {
  console.log(req.body);
  const requiredFields = ['email', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const explicityTrimmedFields = ['email', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]);

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  return User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return Promise.reject({
          code: 409,
          reason: 'ValidationError',
          message: 'Email already taken',
          location: 'email'
        });
      }
    })
    .then(() => {
      return User.hashPassword(req.body.password)
        .then((hashedPassword) => {
          return User.create({
            email: req.body.email,
            password: hashedPassword,
          });
        })
    })
    .then((user) => {
      const activities = ['aerobics', 'basketball', 'running', 'tennis'];
      return User.findByIdAndUpdate(
        user._id, {
          $addToSet:
          {
            activities: {
              $each: activities,
            },
          },
        },
        { new: true },
      );
    })
    .then((user) => {
      console.log(user);
      const message = { message: `Successfully created user: ${user.email}, please log in!` };
      return res.status(200).json(message);
    })
    .catch((err) => {
      console.error(err);
      res.status(err.code || 500).json(err);
    });
});

// User Login
userRouter.post('/user', (req, res) => {
  console.log('.....Inside of api/user post request');
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .populate({
      path: 'exerciseLog',
      select: '_id date activity duration',
    })
    .then((foundUser) => {
      console.log(foundUser);
      return foundUser.validatePassword(req.body.password)
        .then((isPasswordCorrect) => {
          if (!isPasswordCorrect) {
            throw new Error('Sorry, incorrect credentials.  Please try again.');
          }
          else {
            const payload = {
              email: req.body.email,
              _id: foundUser._id,
            };
            const authToken = createAuthToken(payload);
            const sortedActivities = foundUser.activities.sort();
            const parsedData = dataParser(foundUser.exerciseLog);
            const user = {
              message: 'Successfully logged in',
              currentUser: foundUser._id,
              activities: sortedActivities,
              exerciseLog: parsedData.exerciseLog,
              exerciseStatistics: parsedData.exerciseStatistics,
              authToken,
            };
            res.json(user);
          }
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({
        code: 404,
        reason: 'ValidationError',
        message: 'Sorry, incorrect credentials.  Please try again.',
      });
    });
});

userRouter.post('/activity', jwtAuth, (req, res) => {
  console.log(req.user);
  console.log(req.body);
  const activity = req.body.activity.toLowerCase();
  let numActivities;
  User.findById(req.user._id)
    .then((data) => {
      numActivities = data.activities.length
    })
    .then(() => {
      return User.findByIdAndUpdate(
        req.user._id,
        {
          $addToSet:
          { activities: activity },
        },
        { new: true },
      )
    })
    .then((response) => {
      console.log(response);
      if (numActivities === response.activities.length) {
        return res.status(422).json({
          code: 422,
          reason: 'Error',
          message: 'That activity has already been added.',
        });
      }
      const sortedActivities = response.activities.sort();
      res.json({ activities: sortedActivities });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Please try again' });
    });
});

userRouter.get('/user', jwtAuth, (req, res) => {
  console.log(req.user);
  User.findById(req.user._id)
    .populate({
      path: 'exerciseLog',
      select: 'date activity duration',
    })
    .then((result) => {
      const parsedData = dataParser(result.exerciseLog);
      console.log(parsedData);
      const sortedActivities = result.activities.sort();
      const userInfo = {
        currentUser: result._id,
        activities: sortedActivities,
        exerciseLog: parsedData.exerciseLog,
        exerciseStatistics: parsedData.exerciseStatistics,
      };
      res.json(userInfo);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = { userRouter };
