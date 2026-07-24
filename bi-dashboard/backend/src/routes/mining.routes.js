const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mining.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/insights', authMiddleware, ctrl.getPatternInsights);
router.get('/correlation-matrix', authMiddleware, ctrl.getCorrelationMatrix);
router.get('/feature-importance', authMiddleware, ctrl.getFeatureImportance);

module.exports = router;
