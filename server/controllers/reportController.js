const Service = require('../models/Service');
const AMC = require('../models/AMC');
const Customer = require('../models/Customer');

// Generate AMC renewal report
exports.getAMCReport = async (req, res) => {
  try {
    const { dateFrom, dateTo, customerId, status } = req.query;
    let query = {};

    if (customerId) query.customerId = customerId;
    if (status === 'due') query.isDue = true;
    if (status === 'active') query.isActive = true;

    if (dateFrom || dateTo) {
      query.endDate = {};
      if (dateFrom) query.endDate.$gte = new Date(dateFrom);
      if (dateTo) query.endDate.$lte = new Date(dateTo);
    }

    const amcs = await AMC.find(query).populate('customerId', 'name mobileNumber');

    const reportData = amcs.map((amc) => ({
      customerId: amc.customerId._id,
      customerName: amc.customerId.name,
      mobileNumber: amc.customerId.mobileNumber,
      amcName: amc.amcName,
      startDate: amc.startDate,
      endDate: amc.endDate,
      renewalDate: amc.renewalDate,
      amcValue: amc.amcValue,
      status: amc.isDue ? 'Due' : amc.isActive ? 'Active' : 'Inactive',
    }));

    res.json({ success: true, data: reportData, total: reportData.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};

// Generate service report
exports.getServiceReport = async (req, res) => {
  try {
    const { dateFrom, dateTo, employeeId, customerId, status } = req.query;
    let query = {};

    if (employeeId) query.employeeId = employeeId;
    if (customerId) query.customerId = customerId;
    if (status) query.status = status;

    if (dateFrom || dateTo) {
      query.serviceDate = {};
      if (dateFrom) query.serviceDate.$gte = new Date(dateFrom);
      if (dateTo) query.serviceDate.$lte = new Date(dateTo);
    }

    const services = await Service.find(query)
      .populate('customerId', 'name mobileNumber')
      .populate('employeeId', 'fullName');

    const reportData = services.map((service) => ({
      serviceId: service._id,
      customerName: service.customerId.name,
      mobileNumber: service.customerId.mobileNumber,
      employeeName: service.employeeId?.fullName || 'Not Assigned',
      serviceType: service.serviceType,
      serviceDate: service.serviceDate,
      completedDate: service.completedDate,
      status: service.status,
      amount: service.amount,
    }));

    res.json({ success: true, data: reportData, total: reportData.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};

// Generate summary report
exports.getSummaryReport = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    let query = {};
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const totalCustomers = await Customer.countDocuments();
    const totalServices = await Service.countDocuments(query);
    const completedServices = await Service.countDocuments({ ...query, status: 'completed' });
    const pendingServices = await Service.countDocuments({ ...query, status: 'pending' });
    const totalAMCs = await AMC.countDocuments();
    const activeAMCs = await AMC.countDocuments({ isActive: true });
    const dueAMCs = await AMC.countDocuments({ isDue: true });

    const reportData = {
      totalCustomers,
      totalServices,
      completedServices,
      pendingServices,
      pendingPercentage: totalServices > 0 ? ((pendingServices / totalServices) * 100).toFixed(2) : 0,
      completedPercentage: totalServices > 0 ? ((completedServices / totalServices) * 100).toFixed(2) : 0,
      totalAMCs,
      activeAMCs,
      dueAMCs,
      generatedAt: new Date(),
    };

    res.json({ success: true, data: reportData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary', error: error.message });
  }
};

// Export report to Excel (CSV format)
exports.exportReport = async (req, res) => {
  try {
    const { type, dateFrom, dateTo } = req.query;

    if (type === 'services') {
      let query = {};
      if (dateFrom || dateTo) {
        query.serviceDate = {};
        if (dateFrom) query.serviceDate.$gte = new Date(dateFrom);
        if (dateTo) query.serviceDate.$lte = new Date(dateTo);
      }

      const services = await Service.find(query)
        .populate('customerId', 'name mobileNumber')
        .populate('employeeId', 'fullName');

      let csv = 'Service ID,Customer Name,Mobile,Employee,Type,Service Date,Status,Amount\n';
      services.forEach((s) => {
        csv += `${s._id},"${s.customerId.name}",${s.customerId.mobileNumber},"${s.employeeId?.fullName || 'Unassigned'}",${s.serviceType},${s.serviceDate},${s.status},${s.amount || 0}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="services-report.csv"');
      res.send(csv);
    } else if (type === 'amcs') {
      let query = {};
      if (dateFrom || dateTo) {
        query.endDate = {};
        if (dateFrom) query.endDate.$gte = new Date(dateFrom);
        if (dateTo) query.endDate.$lte = new Date(dateTo);
      }

      const amcs = await AMC.find(query).populate('customerId', 'name mobileNumber');

      let csv = 'Customer Name,Mobile,AMC Name,Start Date,End Date,Value,Status\n';
      amcs.forEach((a) => {
        csv += `"${a.customerId.name}",${a.customerId.mobileNumber},"${a.amcName}",${a.startDate},${a.endDate},${a.amcValue},"${a.isDue ? 'Due' : a.isActive ? 'Active' : 'Inactive'}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="amc-report.csv"');
      res.send(csv);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to export report', error: error.message });
  }
};
