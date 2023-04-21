const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a customer
router.get('/:id', getCustomer, (req, res) => {
  res.json(res.customer);
});

// create a customer
router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name
  });
  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update a customer
router.patch('/:id', getCustomer, async (req, res) => {
  if (req.body.name != null) {
    res.customer.name = req.body.name;
  }
  try {
    const updatedCustomer = await res.customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete a customer
router.delete('/:id', getCustomer, async (req, res) => {
  try {
    await res.customer.remove();
    res.json({ message: 'Deleted customer' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


async function getCustomer(req, res, next) {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: 'Cannot find customer' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.customer = customer;
  next();
}
module.exports = router;