const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main');
const { dataParser } = require('../config/utils');
const { User } = require('../models/user');

const jsonParser = bodyParser.json();
const userRouter = express.Router();
userRouter.use(bodyParser.urlencoded({ extended: false }));
mongoose.Promise = global.Promise;

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
userRouter.post('/signup', jsonParser, (req, res) => {
  console.log(req.body);
  return User.hashPassword(req.body.password)
    .then((hashedPassword) => {
      console.log(hashedPassword);
      return User.create({
        email: req.body.email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      const activities = ['basketball', 'tennis', 'running', 'aerobics'];
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
      const message = { message: `Successfully created user: ${user.email}` };
      return res.status(200).json(message);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, something went wrong, please try again...' });
    });
});

// User Login
userRouter.post('/login', jsonParser, (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .populate({
      path: 'exerciseLog',
      select: '_id date activity duration',
    })
    .then((foundUser) => {
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
      res.status(500).json({ error: 'Please try again' });
    });
});

userRouter.post('/activity', jwtAuth, jsonParser, (req, res) => {
  console.log(req.user);
  const activity = req.body.activity.toLowerCase();
  User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet:
      { activities: activity },
    },
    { new: true },
  )
    .then((response) => {
      console.log(response);
      const sortedActivities = response.activities.sort();
      res.json({ activities: sortedActivities });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Please try again' });
    });
});


userRouter.get('/user-info', jwtAuth, (req, res) => {
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
