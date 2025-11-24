const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/', authMiddleware, adminOnly, employeeController.createEmployee);
router.get('/', authMiddleware, employeeController.getEmployees);
router.get('/performance', authMiddleware, adminOnly, employeeController.getEmployeePerformance);
router.get('/:id', authMiddleware, employeeController.getEmployeeById);
router.put('/:id', authMiddleware, adminOnly, employeeController.updateEmployee);
router.delete('/:id', authMiddleware, adminOnly, employeeController.deleteEmployee);

module.exports = router;
