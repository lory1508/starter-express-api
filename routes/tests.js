const express = require('express');
const router = express.Router();
const Test = require('../models/test');

// Get all tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tests by event id
router.get('/event/:id', async (req, res) => {
  try {
    const tests = await Test.find({ eventId: req.params.id }).sort({ date: 'asc' });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get one test
router.get('/:id', getTest, (req, res) => {
  res.json(res.test);
});

// Create one test
router.post('/', async (req, res) => {
  const testRes = await getLatestTestForCounseling(req.body.eventId);
  console.log("testRes",testRes);
  const customerId = testRes.length ? Number(testRes[0].customerId)+1 : 0;
  const test = new Test({
    doctorId: req.body.doctorId,
    counselorId: req.body.counselorId,
    customerId: customerId,
    eventId: req.body.eventId,
    date: Date.now(),
    status: req.body.status
  });
  try {
    const newTest = await test.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get all tests for specific doctor
router.post('/doctor/:id', async (req, res) => {
  try {
    const tests = await Test.find({ doctorId: req.params.id, eventId: req.body.eventId }).sort({ date: 'asc' });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update one test
router.patch('/:id', getTest, async (req, res) => {
  if(req.body.doctorId != null) {
    res.test.doctorId = req.body.doctorId;
  }
  if(req.body.counselorId != null) {
    res.test.counselorId = req.body.counselorId;
  }
  if(req.body.customerId != null) {
    res.test.customerId = req.body.customerId;
  }
  if(req.body.eventId != null) {
    res.test.eventId = req.body.eventId;
  }
  if(req.body.status != null) {
    res.test.status = req.body.status;
  }
  if(req.body.roomId != null) {
    res.test.roomId = req.body.roomId;
  }
  if(req.body.date != null) {
    res.test.date = req.body.date;
  }
  try {
    const updatedTest = await res.test.save();
    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @param {string} id - The id of the test to delete
 */
router.delete('/:id', getTest, async (req, res) => {
  try {
    await Test.deleteOne(res.test);
    res.json({ message: 'Deleted test' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Test.deleteMany();
    res.json({ message: 'Deleted all tests' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/latest', getLatestTestByStatus, (req, res) => {
  res.json(res.test);
});

router.post('/next', async (req, res) => {
  const testRes = await getFirstInLineByStatus(req.body.eventId, req.body.status);
  res.json(testRes);
});

async function getTest(req, res, next) {
  let test;
  try {
    test = await Test.findById(req.params.id);
    if (test == null) {
      return res.status(404).json({ message: 'Cannot find test' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.test = test;
  next();
}

async function getTestByCustomerId(req, res, next) {
  let test;
  try {
    test = await Test.find({ customerId: req.params.id });
    if (test == null) {
      return res.status(404).json({ message: 'Cannot find test' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.test = test;
  next();
}

async function getLatestTestByStatus(req, res, next) {
  let test;
  try {
    test = await Test.find({ status: req.body.status, eventId: req.body.eventId }).sort({ date: 'desc' }).limit(1);
    if (test == null) {
      return res.status(404).json({ message: 'Cannot find test' });
    }
    console.log("test", test);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.test = test;
  next();
}

async function getLatestTestForCounseling(eventId){
  let test;
  try {
    test = Test.find({ status:'waiting', eventId: eventId }).sort({ date: 'desc' }).limit(1);
  } catch (error) {
    console.error(error);
  }
  return test
}

async function getFirstInLineByStatus(eventId, status){
  let test;
  try {
    test = Test.find({ status:status, eventId: eventId }).sort({ date: 'asc' }).limit(1);
  } catch (error) {
    console.error(error);
  }
  return test
}

module.exports = router;