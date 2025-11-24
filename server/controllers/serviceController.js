const Service = require('../models/Service');
const Customer = require('../models/Customer');

// Create service
exports.createService = async (req, res) => {
  try {
    const { customerId, employeeId, serviceType, serviceDate, description } = req.body;

    if (!customerId || !serviceType || !serviceDate) {
      return res.status(400).json({ message: 'Customer, service type, and date are required' });
    }

    const service = new Service({
      customerId,
      employeeId,
      serviceType,
      serviceDate,
      description,
    });

    await service.save();
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
};

// Get all services
exports.getServices = async (req, res) => {
  try {
    const { customerId, employeeId, status, dateFrom, dateTo } = req.query;
    let query = {};

    if (customerId) query.customerId = customerId;
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;

    if (dateFrom || dateTo) {
      query.serviceDate = {};
      if (dateFrom) query.serviceDate.$gte = new Date(dateFrom);
      if (dateTo) query.serviceDate.$lte = new Date(dateTo);
    }

    const services = await Service.find(query)
      .populate('customerId', 'name mobileNumber')
      .populate('employeeId', 'fullName')
      .sort({ serviceDate: -1 });

    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('customerId')
      .populate('employeeId');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch service', error: error.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { employeeId, serviceType, serviceDate, status, description, notes, amount } = req.body;

    if (employeeId) service.employeeId = employeeId;
    if (serviceType) service.serviceType = serviceType;
    if (serviceDate) service.serviceDate = serviceDate;
    if (status) service.status = status;
    if (description) service.description = description;
    if (notes) service.notes = notes;
    if (amount) service.amount = amount;

    await service.save();
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
};

// Complete service
exports.completeService = async (req, res) => {
  try {
    const { otp } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Optional OTP verification
    if (service.otpVerification && otp !== service.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    service.status = 'completed';
    service.completedDate = new Date();

    await service.save();
    res.json({ success: true, data: service, message: 'Service completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete service', error: error.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
};

// Get services by employee
exports.getEmployeeServices = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { employeeId: req.params.employeeId };

    if (status) query.status = status;

    const services = await Service.find(query)
      .populate('customerId', 'name mobileNumber')
      .sort({ serviceDate: -1 });

    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
};
