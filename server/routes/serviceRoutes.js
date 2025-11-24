const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, serviceController.createService);
router.get('/', authMiddleware, serviceController.getServices);
router.get('/:id', authMiddleware, serviceController.getServiceById);
router.put('/:id', authMiddleware, serviceController.updateService);
router.put('/:id/complete', authMiddleware, serviceController.completeService);
router.delete('/:id', authMiddleware, serviceController.deleteService);
router.get('/employee/:employeeId', authMiddleware, serviceController.getEmployeeServices);

module.exports = router;
