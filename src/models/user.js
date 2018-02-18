const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  created: { type: Date, default: Date.now, required: true },
  email: { type: String, lowercase: true, unique: true, required: true },
  password: { type: String, required: true },
  activities: [{ type: String, lowercase: true }],
  exerciseLog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
