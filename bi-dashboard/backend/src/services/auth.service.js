const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

class AuthService {
  async register({ username, email, password, role, fullName }) {
    const existingEmail = await UserModel.findByEmail(email);
    const existingUser = await UserModel.findByUsername(username);
    if (existingEmail || existingUser) throw new Error('Username or email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, email, password: hashedPassword, role, fullName });
    return this.toSafeObject(user);
  }

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    return { token, user: this.toSafeObject(user) };
  }

  async getProfile(userId) {
    return UserModel.findById(userId);
  }

  async getAllUsers() {
    return UserModel.findAll();
  }

  async updateRole(userId, role) {
    return UserModel.updateRole(userId, role);
  }

  toSafeObject(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      createdAt: user.created_at
    };
  }
}

module.exports = new AuthService();
