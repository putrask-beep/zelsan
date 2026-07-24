const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role, fullName } = req.body;
    const user = await authService.register({ username, email, password, role, fullName });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const user = await authService.updateRole(req.params.id, req.body.role);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
