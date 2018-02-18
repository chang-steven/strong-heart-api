const express = require('express');
const passport = require('passport');
const { dataParser } = require('../config/utils');
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');

const exerciseRouter = express.Router();

exerciseRouter.use(passport.initialize());
require('../config/passport')(passport);

const jwtAuth = passport.authenticate('jwt', { session: false });

exerciseRouter.post('/exercise', jwtAuth, (req, res) => {
  console.log(req.body);

  const requiredFields = ['date', 'activity', 'duration'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField,
    });
  }

  Exercise.create({
    userId: req.user._id,
    date: req.body.date,
    activity: req.body.activity,
    duration: req.body.duration,
  })
    .then(result => (
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { exerciseLog: result._id } },
        { new: true },
      ).populate({
        path: 'exerciseLog',
        select: '_id date activity duration',
      })
    ))
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

exerciseRouter.put('/exercise', jwtAuth, (req, res) => {
  console.log(req.body);
  const editedExercise = {
    date: req.body.date,
    activity: req.body.activity,
    duration: req.body.duration,
  };
  console.log(editedExercise);
  Exercise.findByIdAndUpdate(req.body._id, { $set: editedExercise })
    .then(() => (
      User.findById(req.user._id)
        .populate({
          path: 'exerciseLog',
          select: '_id date activity duration',
        })
    ))
    .then((result) => {
      const parsedData = dataParser(result.exerciseLog);
      console.log(parsedData);
      return res.status(200).json(parsedData);
    })
    .catch(() => {
      res.status(500).json({ error: 'Unable to updated specified exercise data' });
    });
});

exerciseRouter.delete('/exercise', jwtAuth, (req, res) => {
  Exercise.findByIdAndRemove(req.body.id)
    .then(() => (
      User.findByIdAndUpdate(req.user._id, { $pull: { exerciseLog: req.body.id } })
        .populate({
          path: 'exerciseLog',
          select: '_id date activity duration',
        })
    ))
    .then((result) => {
      const parsedData = dataParser(result.exerciseLog);
      res.status(200).json(parsedData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Unable to delete specified exercise session' });
    });
});

module.exports = { exerciseRouter };
