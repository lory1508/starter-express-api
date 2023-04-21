const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 'asc' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// Create one user
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    publicName: req.body.publicName,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one user
router.patch('/:id', getUser, async (req, res) => {
  if(req.body.name != null) {
    res.user.name = req.body.name;
  }
  if(req.body.publicName != null) {
    res.user.pIva = req.body.publicName;
  }
  if(req.body.email != null) {
    res.user.email = req.body.email;
  }
  if(req.body.password != null) {
    res.user.password = req.body.password;
  }
  if(req.body.role != null) {
    res.user.role = req.body.role;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @param {string} id - The id of the user to delete
 */
router.delete('/:id', getUser, async (req, res) => {
  try {
    await User.deleteOne(res.user);
    res.json({ message: 'Deleted user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

// login 
router.post('/login', getUserByEmail, async (req, res) => {
  if (req.body.password != null) {
    if (req.body.password == res.user.password) {
      res.json({ 
        message: 'Login successful',
        success: true,
        user: res.user
      });
    } else {
      res.json({ 
        message: 'Login failed',
        success: false
      });
    }
  }
});

async function getUserByEmail(req, res, next) {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}


module.exports = router;