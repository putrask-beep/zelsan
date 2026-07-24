const { Pool } = require('pg');
const dbConfig = require('./config/database');

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

const query = (text, params) => pool.query(text, params);

const getClient = () => pool.connect();

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        full_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS datasets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        stored_filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size BIGINT,
        mime_type VARCHAR(100),
        row_count INTEGER DEFAULT 0,
        column_count INTEGER DEFAULT 0,
        columns JSONB DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'ready', 'error')),
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(20) NOT NULL,
        study_hours_per_day DECIMAL(5,2) DEFAULT 0,
        sleep_hours DECIMAL(5,2) DEFAULT 0,
        phone_usage_hours DECIMAL(5,2) DEFAULT 0,
        social_media_hours DECIMAL(5,2) DEFAULT 0,
        youtube_hours DECIMAL(5,2) DEFAULT 0,
        gaming_hours DECIMAL(5,2) DEFAULT 0,
        breaks_per_day INTEGER DEFAULT 0,
        coffee_intake_mg DECIMAL(6,2) DEFAULT 0,
        exercise_minutes DECIMAL(5,2) DEFAULT 0,
        assignments_completed INTEGER DEFAULT 0,
        attendance_percentage DECIMAL(5,2) DEFAULT 0,
        stress_level INTEGER DEFAULT 5,
        focus_score DECIMAL(5,2) DEFAULT 50,
        final_grade DECIMAL(5,2) DEFAULT 0,
        productivity_score DECIMAL(5,2) DEFAULT 0,
        dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS clusters (
        id SERIAL PRIMARY KEY,
        dataset_id INTEGER REFERENCES datasets(id) ON DELETE CASCADE,
        name VARCHAR(255) DEFAULT 'Clustering Run',
        k INTEGER NOT NULL,
        features JSONB DEFAULT '[]',
        algorithm VARCHAR(50) DEFAULT 'k-means',
        silhouette_score DECIMAL(8,6),
        inertia DECIMAL(15,4),
        calinski_harabasz DECIMAL(12,4),
        centroids JSONB DEFAULT '[]',
        clusters JSONB DEFAULT '[]',
        results JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_students_dataset_id ON students(dataset_id);
      CREATE INDEX IF NOT EXISTS idx_students_gender ON students(gender);
      CREATE INDEX IF NOT EXISTS idx_students_stress_level ON students(stress_level);
      CREATE INDEX IF NOT EXISTS idx_clusters_dataset_id ON clusters(dataset_id);
    `);
    console.log('PostgreSQL tables initialized');
  } finally {
    client.release();
  }
};

module.exports = { pool, query, getClient, initDB };
