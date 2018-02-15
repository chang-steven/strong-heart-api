const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
  userId: { type: String },
  created: { type: Date, default: Date.now, required: true },
  date: { type: String, required: true },
  activity: { type: String, required: true },
  duration: { type: Number, required: true },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = { Exercise };
