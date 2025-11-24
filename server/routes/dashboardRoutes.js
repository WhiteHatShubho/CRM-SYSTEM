const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

router.get('/metrics', authMiddleware, dashboardController.getDashboard);
router.get('/pending-services', authMiddleware, dashboardController.getPendingServices);

module.exports = router;
