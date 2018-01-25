const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
    .then(() => {
      const message = { message: 'Successfully created user' };
      return res.status(200).json(message);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, something went wrong, please try again...' });
    });
});


userRouter.post('/login', jsonParser, (req, res) => {
  console.log(req.body);
  const user = {
    message: 'Successfully reached /login',
    user: {
      email: req.body.email,
      _id: '5a67c4d7e5db540a788198ec',
      activities: ['basketball', 'tennis', 'running', 'aerobics'],
    },
  };
  res.json(user);
});

module.exports = { userRouter };
