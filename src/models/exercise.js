const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, require: true },
  activity: { type: String, required: true },
  duration: { type: Number, required: true },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = { Exercise };
