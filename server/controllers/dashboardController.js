const Customer = require('../models/Customer');
const Service = require('../models/Service');
const AMC = require('../models/AMC');

// Get dashboard metrics
exports.getDashboard = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const recurringCustomers = await Customer.countDocuments({ isRecurring: true });
    
    const pendingServices = await Service.countDocuments({ status: 'pending' });
    const completedServices = await Service.countDocuments({ status: 'completed' });
    
    const amcDue = await AMC.countDocuments({ isDue: true, isActive: true });
    const activeAMCs = await AMC.countDocuments({ isActive: true });

    // Weekly and monthly data
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyServices = await Service.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const monthlyServices = await Service.countDocuments({
      createdAt: { $gte: monthAgo },
    });

    res.json({
      success: true,
      metrics: {
        totalCustomers,
        recurringCustomers,
        pendingServices,
        completedServices,
        amcDue,
        activeAMCs,
        weeklyServices,
        monthlyServices,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
};

// Get pending services
exports.getPendingServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'pending' })
      .populate('customerId', 'name mobileNumber')
      .populate('employeeId', 'fullName')
      .sort({ serviceDate: 1 });

    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
};
