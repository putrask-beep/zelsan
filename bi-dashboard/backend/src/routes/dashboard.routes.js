const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, ctrl.getDashboardData);
router.get('/activity', authMiddleware, ctrl.getActivityData);
router.get('/energy', authMiddleware, ctrl.getEnergyData);
router.get('/kpis', authMiddleware, ctrl.getKPIData);
router.get('/correlations', authMiddleware, ctrl.getCorrelationData);

module.exports = router;
