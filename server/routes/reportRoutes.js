const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/amc', authMiddleware, reportController.getAMCReport);
router.get('/services', authMiddleware, reportController.getServiceReport);
router.get('/summary', authMiddleware, reportController.getSummaryReport);
router.get('/export', authMiddleware, adminOnly, reportController.exportReport);

module.exports = router;
