const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/profile', authMiddleware, ctrl.getProfile);
router.get('/users', authMiddleware, adminOnly, ctrl.getAllUsers);
router.put('/users/:id/role', authMiddleware, adminOnly, ctrl.updateRole);

module.exports = router;
