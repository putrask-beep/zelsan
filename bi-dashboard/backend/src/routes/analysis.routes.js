const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analysis.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/overview', authMiddleware, ctrl.getOverview);
router.get('/kpis', authMiddleware, ctrl.getKPIs);
router.get('/correlations', authMiddleware, ctrl.getCorrelations);
router.get('/field/:field', authMiddleware, ctrl.getFieldStats);
router.get('/distribution/:field', authMiddleware, ctrl.getDistribution);
router.get('/comparison', authMiddleware, ctrl.getComparison);

module.exports = router;
