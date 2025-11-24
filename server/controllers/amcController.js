const AMC = require('../models/AMC');

// Create AMC
exports.createAMC = async (req, res) => {
  try {
    const { customerId, amcName, startDate, endDate, serviceFrequency, amcValue } = req.body;

    if (!customerId || !amcName || !startDate || !endDate || !amcValue) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Calculate next service date
    const start = new Date(startDate);
    let nextServiceDate = new Date(start);

    switch (serviceFrequency || 'quarterly') {
      case 'monthly':
        nextServiceDate.setMonth(nextServiceDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextServiceDate.setMonth(nextServiceDate.getMonth() + 3);
        break;
      case 'half-yearly':
        nextServiceDate.setMonth(nextServiceDate.getMonth() + 6);
        break;
      case 'yearly':
        nextServiceDate.setFullYear(nextServiceDate.getFullYear() + 1);
        break;
    }

    const amc = new AMC({
      customerId,
      amcName,
      startDate,
      endDate,
      nextServiceDate,
      serviceFrequency: serviceFrequency || 'quarterly',
      amcValue,
    });

    await amc.save();
    res.status(201).json({ success: true, data: amc });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create AMC', error: error.message });
  }
};

// Get all AMCs
exports.getAMCs = async (req, res) => {
  try {
    const { customerId, status } = req.query;
    let query = {};

    if (customerId) query.customerId = customerId;
    if (status === 'due') query.isDue = true;
    if (status === 'active') query.isActive = true;

    const amcs = await AMC.find(query).populate('customerId', 'name mobileNumber').sort({ endDate: 1 });
    res.json({ success: true, data: amcs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch AMCs', error: error.message });
  }
};

// Get AMC by ID
exports.getAMCById = async (req, res) => {
  try {
    const amc = await AMC.findById(req.params.id).populate('customerId');
    if (!amc) {
      return res.status(404).json({ message: 'AMC not found' });
    }

    res.json({ success: true, data: amc });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch AMC', error: error.message });
  }
};

// Update AMC
exports.updateAMC = async (req, res) => {
  try {
    let amc = await AMC.findById(req.params.id);
    if (!amc) {
      return res.status(404).json({ message: 'AMC not found' });
    }

    const { amcName, startDate, endDate, renewalDate, serviceFrequency, amcValue, isActive, isDue } = req.body;

    if (amcName) amc.amcName = amcName;
    if (startDate) amc.startDate = startDate;
    if (endDate) amc.endDate = endDate;
    if (renewalDate) amc.renewalDate = renewalDate;
    if (serviceFrequency) amc.serviceFrequency = serviceFrequency;
    if (amcValue) amc.amcValue = amcValue;
    if (isActive !== undefined) amc.isActive = isActive;
    if (isDue !== undefined) amc.isDue = isDue;

    await amc.save();
    res.json({ success: true, data: amc });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update AMC', error: error.message });
  }
};

// Delete AMC
exports.deleteAMC = async (req, res) => {
  try {
    const amc = await AMC.findByIdAndDelete(req.params.id);
    if (!amc) {
      return res.status(404).json({ message: 'AMC not found' });
    }

    res.json({ success: true, message: 'AMC deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete AMC', error: error.message });
  }
};

// Mark AMC as due
exports.markAMCDue = async (req, res) => {
  try {
    const amc = await AMC.findByIdAndUpdate(
      req.params.id,
      { isDue: true },
      { new: true }
    );

    if (!amc) {
      return res.status(404).json({ message: 'AMC not found' });
    }

    res.json({ success: true, data: amc, message: 'AMC marked as due' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark AMC as due', error: error.message });
  }
};

// Renew AMC
exports.renewAMC = async (req, res) => {
  try {
    const { newEndDate, newAmcValue } = req.body;

    if (!newEndDate) {
      return res.status(400).json({ message: 'New end date is required' });
    }

    const amc = await AMC.findByIdAndUpdate(
      req.params.id,
      {
        renewalDate: new Date(),
        endDate: newEndDate,
        isDue: false,
        isActive: true,
        amcValue: newAmcValue || amc.amcValue,
      },
      { new: true }
    );

    if (!amc) {
      return res.status(404).json({ message: 'AMC not found' });
    }

    res.json({ success: true, data: amc, message: 'AMC renewed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to renew AMC', error: error.message });
  }
};
