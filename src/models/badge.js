const mongoose = require('mongoose');

const badgeSchema = mongoose.Schema({
  name: { type: String, lowercase: true, unique: true, require: true },
  url: { type: String, require: true },
});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = { Badge };
