const User = require('../models/User');

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const { fullName, email, password, department, phone } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    let employee = await User.findOne({ email });
    if (employee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    employee = new User({
      fullName,
      email,
      password,
      role: 'employee',
      department,
      phone,
    });

    await employee.save();
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create employee', error: error.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    let query = { role: 'employee' };

    if (department) query.department = department;

    const employees = await User.find(query).sort({ fullName: 1 });
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Get employee service stats
    const Service = require('../models/Service');
    const completedServices = await Service.countDocuments({
      employeeId: req.params.id,
      status: 'completed',
    });

    const pendingServices = await Service.countDocuments({
      employeeId: req.params.id,
      status: 'pending',
    });

    res.json({
      success: true,
      data: {
        ...employee.toObject(),
        completedServices,
        pendingServices,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    let employee = await User.findById(req.params.id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { fullName, department, phone, isActive } = req.body;

    if (fullName) employee.fullName = fullName;
    if (department) employee.department = department;
    if (phone) employee.phone = phone;
    if (isActive !== undefined) employee.isActive = isActive;

    await employee.save();
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);

    if (!employee || employee.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
};

// Get employee performance
exports.getEmployeePerformance = async (req, res) => {
  try {
    const Service = require('../models/Service');

    const employees = await User.find({ role: 'employee' });

    const performance = await Promise.all(
      employees.map(async (emp) => ({
        id: emp._id,
        name: emp.fullName,
        completedServices: await Service.countDocuments({
          employeeId: emp._id,
          status: 'completed',
        }),
        pendingServices: await Service.countDocuments({
          employeeId: emp._id,
          status: 'pending',
        }),
        totalServices: await Service.countDocuments({
          employeeId: emp._id,
        }),
      }))
    );

    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch performance', error: error.message });
  }
};
