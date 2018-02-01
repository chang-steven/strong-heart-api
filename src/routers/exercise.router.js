const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const exerciseRouter = express.Router();
exerciseRouter.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = global.Promise;
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');
const { Badge } = require('../models/badge');

exerciseRouter.get('/exercise-log', (req, res) => {
  const exerciseLogArray = [
    {
      _id: '5a62904f0fb100561e03e36e',
      date: '2018-01-24',
      duration: 10,
      activity: 'tennis',
    },
    {
      _id: '5a629464f267925685d62524',
      date: '2017-12-02',
      duration: 25,
      activity: 'aerobics',
    },
    {
      _id: '6a62904f0fb100561e03e36e',
      date: '2017-12-23',
      duration: 30,
      activity: 'running',
    },
    {
      _id: '6a629464f267925685d62524',
      date: '2018-01-09',
      duration: 45,
      activity: 'aerobics',
    },
    {
      _id: '7a62904f0fb100561e03e36e',
      date: '2017-12-20',
      duration: 60,
      activity: 'tennis',
    },
    {
      _id: '7a629464f267925685d62524',
      date: '2018-01-06',
      duration: 55,
      activity: 'basketball',
    },
    {
      _id: '5a62904f0fb100561e03e36e',
      date: '2018-01-21',
      duration: 10,
      activity: 'tennis',
    },
    {
      _id: '5a629464f267925685d62524',
      date: '2017-12-10',
      duration: 25,
      activity: 'running',
    },
    {
      _id: '6a62904f0fb100561e03e36e',
      date: '2017-12-13',
      duration: 30,
      activity: 'tennis',
    },
    {
      _id: '6a629464f267925685d62524',
      date: '2018-01-01',
      duration: 45,
      activity: 'basketball',
    },
    {
      _id: '7a62904f0fb100561e03e36e',
      date: '2017-12-03',
      duration: 60,
      activity: 'tennis',
    },
  ];
  exerciseLogArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalExerciseSessions = exerciseLogArray.length;
  let totalExerciseMinutes = 0;
  const activitiesCount = {};

  exerciseLogArray.forEach((exercise) => {
    totalExerciseMinutes += exercise.duration;
    if (!(exercise.activity in activitiesCount)) {
      activitiesCount[exercise.activity] = 1;
    }
    else {
      activitiesCount[exercise.activity] += 1;
    }
  });

  const activitiesArray = [];
  const activities = Object.keys(activitiesCount);
  const count = Object.values(activitiesCount);
  for (let i = 0; i < activities.length; i++) {
    const myObj = {};
    myObj.activity = activities[i];
    myObj.count = count[i];
    activitiesArray.push(myObj);
  }
  const statistics = {
    totalExerciseSessions,
    totalExerciseMinutes,
    averageMinutesPerSession: (totalExerciseMinutes / totalExerciseSessions).toFixed(1),
    activitiesArray,
    activities,
    count,
  };

  const responseObject = {
    exerciseLog: exerciseLogArray,
    statistics,
  };

  res.json(responseObject);
});

exerciseRouter.post('/add-exercise', jsonParser, (req, res) => {
  console.log(req.body);
  // console.log(req.user);
  Exercise.create({
    date: req.body.date,
    activity: req.body.activity,
    duration: req.body.duration,
  })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Sorry, something went wrong, please try again...' });
    });
});

exerciseRouter.put('/edit-exercise/:id', jsonParser, (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  const editedExercise = {
    date: req.body.date,
    activity: req.body.activity,
    duration: req.body.duration,
  };
  console.log(editedExercise);
  Exercise.findByIdAndUpdate(req.params.id, { $set: editedExercise }, { new: true })
    .then((result) => {
      console.log(result);
      const message = 'Succesfully edited exercise data';
      res.status(200).json(message);
    })
    .catch(() => {
      res.status(500).json({ error: 'Unable to updated specified exercise data' });
    });
});

module.exports = { exerciseRouter };
