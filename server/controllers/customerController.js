const Customer = require('../models/Customer');

// Create customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, mobileNumber, email, address, city, state, pincode, isRecurring } = req.body;

    if (!name || !mobileNumber) {
      return res.status(400).json({ message: 'Name and mobile number are required' });
    }

    let customer = await Customer.findOne({ mobileNumber });
    if (customer) {
      return res.status(400).json({ message: 'Customer with this mobile number already exists' });
    }

    customer = new Customer({
      name,
      mobileNumber,
      email,
      address,
      city,
      state,
      pincode,
      isRecurring: isRecurring || false,
    });

    await customer.save();
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create customer', error: error.message });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { mobileNumber: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customers', error: error.message });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customer', error: error.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const { name, email, address, city, state, pincode, isRecurring, notes } = req.body;

    if (name) customer.name = name;
    if (email) customer.email = email;
    if (address) customer.address = address;
    if (city) customer.city = city;
    if (state) customer.state = state;
    if (pincode) customer.pincode = pincode;
    if (isRecurring !== undefined) customer.isRecurring = isRecurring;
    if (notes) customer.notes = notes;

    await customer.save();
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update customer', error: error.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer', error: error.message });
  }
};

// Get customer service history
exports.getCustomerHistory = async (req, res) => {
  try {
    const Service = require('../models/Service');
    const AMC = require('../models/AMC');

    const services = await Service.find({ customerId: req.params.id }).sort({ serviceDate: -1 });
    const amcs = await AMC.find({ customerId: req.params.id }).sort({ startDate: -1 });

    res.json({
      success: true,
      data: {
        services,
        amcs,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};
