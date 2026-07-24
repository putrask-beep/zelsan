const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clustering.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/run', authMiddleware, adminOnly, ctrl.runClustering);
router.get('/history', authMiddleware, ctrl.getClusterHistory);
router.get('/:id', authMiddleware, ctrl.getClusterById);
router.get('/:id/visualization', authMiddleware, ctrl.getClusterVisualization);

module.exports = router;
