const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one room
router.get('/:id', getRoom, (req, res) => {
  res.json(res.room);
});

// Create one room
router.post('/', async (req, res) => {
  const room = new Room({
    type: req.body.type,
    name: req.body.name
  });
  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one room
router.patch('/:id', getRoom, async (req, res) => {
  if(req.body.name != null) {
    res.room.name = req.body.name;
  }
  if(req.body.type != null) {
    res.room.type = req.body.type;
  }
  try {
    const updatedRoom = await res.room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @param {string} id - The id of the room to delete
 */
router.delete('/:id', getRoom, async (req, res) => {
  try {
    await Room.deleteOne(res.room);
    res.json({ message: 'Deleted room' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getRoom(req, res, next) {
  let room;
  try {
    room = await Room.findById(req.params.id);
    if (room == null) {
      return res.status(404).json({ message: 'Cannot find room' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.room = room;
  next();
}

module.exports = router;