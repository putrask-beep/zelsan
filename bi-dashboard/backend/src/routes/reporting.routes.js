const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reporting.controller');
const { authMiddleware } = require('../middleware/auth');

router.get('/pdf', authMiddleware, ctrl.generatePDF);
router.get('/excel', authMiddleware, ctrl.generateExcel);
router.get('/data', authMiddleware, ctrl.getReportData);

module.exports = router;
