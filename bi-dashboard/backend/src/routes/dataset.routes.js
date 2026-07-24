const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dataset.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/import', authMiddleware, adminOnly, upload.single('file'), ctrl.importDataset);
router.get('/', authMiddleware, ctrl.getDatasets);
router.get('/:id', authMiddleware, ctrl.getDatasetById);
router.get('/:id/students', authMiddleware, ctrl.getDatasetStudents);
router.delete('/:id', authMiddleware, adminOnly, ctrl.deleteDataset);

module.exports = router;
