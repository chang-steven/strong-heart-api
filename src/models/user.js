const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, require: true },
  password: { type: String, require: true },
  activities: [{ type: String, lowercase: true }],
  // exerciseLog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExerciseLog' }]
  // badges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Badges'}]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
