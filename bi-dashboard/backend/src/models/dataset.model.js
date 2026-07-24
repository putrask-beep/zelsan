const { query } = require('../db');

const DatasetModel = {
  async create({ name, originalFilename, storedFilename, filePath, fileSize, mimeType, uploadedBy }) {
    const { rows } = await query(
      `INSERT INTO datasets (name, original_filename, stored_filename, file_path, file_size, mime_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, originalFilename, storedFilename, filePath, fileSize, mimeType, uploadedBy]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM datasets WHERE id = $1', [id]);
    return rows[0];
  },

  async findAll() {
    const { rows } = await query('SELECT * FROM datasets ORDER BY created_at DESC');
    return rows;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return this.findById(id);
    const setClauses = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];
    const { rows } = await query(
      `UPDATE datasets SET ${setClauses}, updated_at = NOW() WHERE id = $1 RETURNING *`, values
    );
    return rows[0];
  },

  async delete(id) {
    const { rows } = await query('DELETE FROM datasets WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  }
};

module.exports = DatasetModel;
