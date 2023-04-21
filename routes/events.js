const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one event
router.get('/:id', getEvent, (req, res) => {
  res.json(res.event);
});

// Create one event
router.post('/', async (req, res) => {
  const event = new Event({
    location: req.body.location,
    date: req.body.date,
    doctorsId: req.body.doctorsId,
    counselorsId: req.body.counselorsId,
    roomsId: req.body.roomsId
  });
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one event
router.patch('/:id', getEvent, async (req, res) => {
  if(req.body.location != null) {
    res.event.location = req.body.location;
  }
  if(req.body.date != null) {
    res.event.date = req.body.date;
  }
  if(req.body.doctorsId != null) {
    res.event.doctorsId = req.body.doctorsId;
  }
  if(req.body.counselorsId != null) {
    res.event.counselorsId = req.body.counselorsId;
  }
  if(req.body.roomsId != null) {
    res.event.roomsId = req.body.roomsId;
  }
  try {
    const updatedEvent = await res.event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @param {string} id - The id of the event to delete
 */
router.delete('/:id', getEvent, async (req, res) => {
  try {
    await Event.deleteOne(res.event);
    res.json({ message: 'Deleted event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Event.deleteMany();
    res.json({ message: 'Deleted all events' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getEvent(req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: 'Cannot find event' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.event = event;
  next();
}

module.exports = router;