const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String },
  platoon: { type: String },
  company: { type: String },
  phone: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Person', personSchema);
