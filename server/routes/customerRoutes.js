const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, customerController.createCustomer);
router.get('/', authMiddleware, customerController.getCustomers);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);
router.get('/:id/history', authMiddleware, customerController.getCustomerHistory);

module.exports = router;
