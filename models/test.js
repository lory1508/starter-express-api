const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: false
  },
  counselorId: {
    type: String,
    required: false
  },
  customerId: {
    type: String,
    required: false
  },
  roomId: {
    type: String,
    required: false
  },
  eventId: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('test', testSchema);