const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/datasets', require('./dataset.routes'));
router.use('/analysis', require('./analysis.routes'));
router.use('/mining', require('./mining.routes'));
router.use('/clustering', require('./clustering.routes'));
router.use('/reporting', require('./reporting.routes'));
router.use('/dashboard', require('./dashboard.routes'));

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
