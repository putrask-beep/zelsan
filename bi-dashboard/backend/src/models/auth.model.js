const { query } = require('../db');

const UserModel = {
  async create({ username, email, password, role = 'user', fullName }) {
    const { rows } = await query(
      `INSERT INTO users (username, email, password, role, full_name)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, full_name, created_at`,
      [username, email, password, role, fullName]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findByUsername(username) {
    const { rows } = await query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query(
      'SELECT id, username, email, role, full_name, created_at FROM users WHERE id = $1', [id]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await query('SELECT id, username, email, role, full_name, created_at FROM users ORDER BY created_at DESC');
    return rows;
  },

  async updateRole(id, role) {
    const { rows } = await query(
      'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, email, role, full_name, created_at',
      [role, id]
    );
    return rows[0];
  }
};

module.exports = UserModel;
