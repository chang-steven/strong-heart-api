const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const { dataParser } = require('../config/utils');

const jsonParser = bodyParser.json();
const exerciseRouter = express.Router();
exerciseRouter.use(bodyParser.urlencoded({ extended: false }));

exerciseRouter.use(passport.initialize());
require('../config/passport')(passport);

const jwtAuth = passport.authenticate('jwt', { session: false });

mongoose.Promise = global.Promise;
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');

exerciseRouter.post('/add-exercise', jwtAuth, jsonParser, (req, res) => {
  console.log(req.body);
  Exercise.create({
    userId: req.user._id,
    date: req.body.date,
    activity: req.body.activity,
    duration: req.body.duration,
  })
    .then((result) => {
      return User.findByIdAndUpdate(
        req.user._id,
        { $push: { exerciseLog: result._id } },
        { new: true },
      )
        .populate({
          path: 'exerciseLog',
          select: '_id date activity duration',
        });
    })
    .then((result) => {
      const parsedData = dataParser(result.exerciseLog);
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
          select: '_id date activity duration',
        });
    })
    .then((result) => {
      const parsedData = dataParser(result.exerciseLog);
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
