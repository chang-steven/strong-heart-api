const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main')


const jsonParser = bodyParser.json();

const userRouter = express.Router();
userRouter.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = global.Promise;
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');
const { Badge } = require('../models/badge');

userRouter.get('/badges', (req, res) => {
  res.json([
    {
      name: 'Got Started',
      link: 'http://via.placeholder.com/200x200',
      earned: true,
      date: '01/02/18',
    },
    {
      name: 'Two in a Row',
      link: 'http://via.placeholder.com/200x200',
      earned: false,
      date: '12/23/17',
    },
    {
      name: 'Got Started',
      link: 'http://via.placeholder.com/200x200',
      earned: true,
      date: '01/02/18',
    },
    {
      name: 'Two in a Row',
      link: 'http://via.placeholder.com/200x200',
      earned: false,
      date: '12/23/17',
    },
  ]);
});

userRouter.post('/signup', jsonParser, (req, res) => {
  console.log(req.body);
  User.create({
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => {
      const activities = ['basketball', 'tennis', 'running', 'aerobics'];
      return User.findByIdAndUpdate(user._id, {
        $addToSet:
        {
          activities: {
            $each: activities,
          },
        }
      },
      { new: true });
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

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

userRouter.post('/login', jsonParser, (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      console.log(foundUser);
      if (!(foundUser.password === req.body.password)) {
        throw new Error('Sorry, incorrect credential.  Please Try again.')
      }

      else {
        const payload = {
          email: req.body.email,
          _id: foundUser._id
        }
        const authToken = createAuthToken(payload)
        const activitiesArraySorted = foundUser.activities.sort();
        const user = {
          message: 'Successfully reached /login',
          user: {
            email: foundUser.email,
            _id: foundUser._id,
            activities: activitiesArraySorted,
            authToken
          },
        };
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);;
      res.status(500).json({ error: 'Please try again' });
    });
});

userRouter.post('/activity', jsonParser, (req, res) => {
  console.log(req.body);
  const activity = req.body.activity.toLowerCase();
  User.findByIdAndUpdate(
    req.body.id,
    {
      $addToSet:
      { activities: activity }
    },
    { new: true },
  )
    .then((response) => {
      console.log(response);
      res.json({ activities: response.activities })
    })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'Please try again' });
  });
});


// userRouter.post('/login', jsonParser, (req, res) => {
//   console.log(req.body);
//   const mockActivities = ['basketball', 'tennis', 'running', 'aerobics']
//   const activitiesArraySorted = mockActivities.sort();
//   const user = {
//     message: 'Successfully reached /login',
//     user: {
//       email: req.body.email,
//       _id: '5a67c4d7e5db540a788198ec',
//       activities: activitiesArraySorted,
//     },
//   };
//   res.json(user);
// });

module.exports = { userRouter };
