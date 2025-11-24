const express = require('express');
const router = express.Router();
const amcController = require('../controllers/amcController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, amcController.createAMC);
router.get('/', authMiddleware, amcController.getAMCs);
router.get('/:id', authMiddleware, amcController.getAMCById);
router.put('/:id', authMiddleware, amcController.updateAMC);
router.delete('/:id', authMiddleware, amcController.deleteAMC);
router.put('/:id/mark-due', authMiddleware, amcController.markAMCDue);
router.put('/:id/renew', authMiddleware, amcController.renewAMC);

module.exports = router;
