const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/password', authMiddleware, authController.updatePassword);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
