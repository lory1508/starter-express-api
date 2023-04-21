const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false,
    default: Date.now
  },
  doctorsId: {
    type: Array,
    required: false
  },
  counselorsId: {
    type: Array,
    required: false
  },
  roomsId: {
    type: Array,
    required: false
  }
});

module.exports = mongoose.model('event', eventSchema);