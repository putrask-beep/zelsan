const { query } = require('../db');

const ClusterModel = {
  async create({ datasetId, name, k, features, algorithm, silhouetteScore, inertia, calinskiHarabasz, centroids, clusters, results }) {
    const { rows } = await query(
      `INSERT INTO clusters (dataset_id, name, k, features, algorithm, silhouette_score, inertia, calinski_harabasz, centroids, clusters, results)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [datasetId, name, k, JSON.stringify(features), algorithm, silhouetteScore, inertia, calinskiHarabasz,
       JSON.stringify(centroids), JSON.stringify(clusters), JSON.stringify(results)]
    );
    return rows[0];
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM clusters WHERE id = $1', [id]);
    return rows[0];
  },

  async findByDataset(datasetId) {
    const q = datasetId
      ? 'SELECT * FROM clusters WHERE dataset_id = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM clusters ORDER BY created_at DESC';
    const params = datasetId ? [datasetId] : [];
    const { rows } = await query(q, params);
    return rows.map(this._parseJSON);
  },

  async findLatest(datasetId) {
    const q = datasetId
      ? 'SELECT * FROM clusters WHERE dataset_id = $1 ORDER BY created_at DESC LIMIT 1'
      : 'SELECT * FROM clusters ORDER BY created_at DESC LIMIT 1';
    const params = datasetId ? [datasetId] : [];
    const { rows } = await query(q, params);
    return rows[0] ? this._parseJSON(rows[0]) : null;
  },

  _parseJSON(row) {
    if (!row) return row;
    try { row.features = typeof row.features === 'string' ? JSON.parse(row.features) : row.features; } catch { row.features = []; }
    try { row.centroids = typeof row.centroids === 'string' ? JSON.parse(row.centroids) : row.centroids; } catch { row.centroids = []; }
    try { row.clusters = typeof row.clusters === 'string' ? JSON.parse(row.clusters) : row.clusters; } catch { row.clusters = []; }
    try { row.results = typeof row.results === 'string' ? JSON.parse(row.results) : row.results; } catch { row.results = []; }
    return row;
  }
};

module.exports = ClusterModel;
