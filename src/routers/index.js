const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }))

const { User } = require('../models/user');

router.get('/test', (req, res) => {
  res.json({ ok: true });
});


router.get('/exercise-log', (req, res) => {
  res.json([
    {
      date: '01/02/18',
      duration: 30,
      type: 'tennis',
    },
    {
      date: '12/23/17',
      duration: 55,
      type: 'basketball',
    },
    {
      date: '01/02/18',
      duration: 30,
      type: 'tennis',
    },
    {
      date: '12/23/17',
      duration: 55,
      type: 'basketball',
    },
    {
      date: '01/02/18',
      duration: 30,
      type: 'tennis',
    },
    {
      date: '12/23/17',
      duration: 55,
      type: 'basketball',
    },
  ]);
});

router.get('/badges', (req, res) => {
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

router.post('/signup', jsonParser, (req, res) => {
  // User.create({
  //   email: req.body.email,
  //   password: req.body.password,
  // })
  //   .then(() => {
  //     const message = { message: `Successfully created user ${req.body.username}` };
  //     return res.status(200).json(message);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).json({ message: 'Sorry, something went wrong, please try again...' });
  //   });

  console.log(req.body);
  res.json(req.body);
});

router.post('/login', jsonParser, (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

router.post('/add-exercise', jsonParser, (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

module.exports = { router };
