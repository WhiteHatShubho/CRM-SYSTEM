const express = require('express');
const router = express.Router();
const smsService = require('../services/smsService');
const { authMiddleware } = require('../middleware/auth');

// Send WhatsApp to single customer
router.post('/send', authMiddleware, smsService.sendWhatsAppToCustomer);

// Send WhatsApp to all customers (One tap)
router.post('/send-all', authMiddleware, smsService.sendWhatsAppToAll);

module.exports = router;
