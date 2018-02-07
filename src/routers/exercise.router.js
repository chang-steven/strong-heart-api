const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/main');
const { dataParser } = require('../config/utils');


const exerciseRouter = express.Router();
exerciseRouter.use(bodyParser.urlencoded({ extended: false }))

exerciseRouter.use(passport.initialize());
require('../config/passport')(passport);

const jwtAuth = passport.authenticate('jwt', { session: false });


mongoose.Promise = global.Promise;
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');
const { Badge } = require('../models/badge');

// exerciseRouter.get('/exercise-log', (req, res) => {
//   const exerciseLogArray = [
//     {
//       _id: '5a62904f0fb100561e03e36e',
//       date: '2018-01-24',
//       duration: 10,
//       activity: 'tennis',
//     },
//     {
//       _id: '5a629464f267925685d62524',
//       date: '2017-12-02',
//       duration: 25,
//       activity: 'aerobics',
//     },
//     {
//       _id: '6a62904f0fb100561e03e36e',
//       date: '2017-12-23',
//       duration: 30,
//       activity: 'running',
//     },
//     {
//       _id: '6a629464f267925685d62524',
//       date: '2018-01-09',
//       duration: 45,
//       activity: 'aerobics',
//     },
//     {
//       _id: '7a62904f0fb100561e03e36e',
//       date: '2017-12-20',
//       duration: 60,
//       activity: 'tennis',
//     },
//     {
//       _id: '7a629464f267925685d62524',
//       date: '2018-01-06',
//       duration: 55,
//       activity: 'basketball',
//     },
//     {
//       _id: '5a62904f0fb100561e03e36e',
//       date: '2018-01-21',
//       duration: 10,
//       activity: 'tennis',
//     },
//     {
//       _id: '5a629464f267925685d62524',
//       date: '2017-12-10',
//       duration: 25,
//       activity: 'running',
//     },
//     {
//       _id: '6a62904f0fb100561e03e36e',
//       date: '2017-12-13',
//       duration: 30,
//       activity: 'tennis',
//     },
//     {
//       _id: '6a629464f267925685d62524',
//       date: '2018-01-01',
//       duration: 45,
//       activity: 'basketball',
//     },
//     {
//       _id: '7a62904f0fb100561e03e36e',
//       date: '2017-12-03',
//       duration: 60,
//       activity: 'tennis',
//     },
//   ];
//
//   const responseObject = dataParser(exerciseLogArray);
//   res.json(responseObject);
// });

exerciseRouter.post('/add-exercise', jwtAuth, jsonParser, (req, res) => {
  console.log(req.body);
  // console.log(req.user);
  Exercise.create({
    userId: req.user._id,
    date: req.body.date,
    activity: req.body.activity,
    duration: req.body.duration,
  })
    .then((result) => {
      return User.findByIdAndUpdate(req.user._id, { $push: { exerciseLog: result._id } }, { new: true })
      .populate({
          path: 'exerciseLog',
          select: '_id date activity duration'
        });
    })
    .then((result) => {
      const parsedData = dataParser(result.exerciseLog)
      console.log(parsedData);

      return res.status(200).json(parsedData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, something went wrong, please try again...' });
    });
});

exerciseRouter.put('/edit-exercise/', jwtAuth, jsonParser, (req, res) => {
  console.log(req.body);
  const editedExercise = {
    date: req.body.date,
    activity: req.body.activity,
    duration: req.body.duration,
  };
  console.log(editedExercise);
  Exercise.findByIdAndUpdate(req.body._id, { $set: editedExercise })
    .then(() => {
      return User.findById(req.user._id)
        .populate({
          path: 'exerciseLog',
          select: '_id date activity duration'
        });
    })
    .then((result) => {
      const parsedData = dataParser(result.exerciseLog)
      console.log(parsedData);

      return res.status(200).json(parsedData);
    })
    .catch(() => {
      res.status(500).json({ error: 'Unable to updated specified exercise data' });
    });
});

exerciseRouter.delete('/delete', jwtAuth, jsonParser, (req, res) => {
  console.log(req.body);
  Exercise.findByIdAndRemove(req.body.id)
    .then(() => {
      res.status(200).json({ message: 'Successfully deleted exercise session' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Unable to delete specified exercise session' });
    });
});

module.exports = { exerciseRouter };
