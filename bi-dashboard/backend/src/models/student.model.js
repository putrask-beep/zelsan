const { query } = require('../db');

const StudentModel = {
  async bulkCreate(students) {
    const values = [];
    const placeholders = [];
    let idx = 1;

    students.forEach((s) => {
      placeholders.push(
        `($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`
      );
      values.push(
        s.student_id, s.age, s.gender,
        s.study_hours_per_day, s.sleep_hours, s.phone_usage_hours,
        s.social_media_hours, s.youtube_hours, s.gaming_hours,
        s.breaks_per_day, s.coffee_intake_mg, s.exercise_minutes,
        s.assignments_completed, s.attendance_percentage,
        s.stress_level, s.focus_score, s.final_grade,
        s.productivity_score, s.dataset_id
      );
    });

    if (!values.length) return [];

    const batchSize = 500;
    for (let i = 0; i < students.length; i += batchSize) {
      const batchPlaceholders = [];
      const batchValues = [];
      let bIdx = 1;
      for (let j = i; j < Math.min(i + batchSize, students.length); j++) {
        const s = students[j];
        batchPlaceholders.push(
          `($${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++}, $${bIdx++})`
        );
        batchValues.push(
          s.student_id, s.age, s.gender,
          s.study_hours_per_day, s.sleep_hours, s.phone_usage_hours,
          s.social_media_hours, s.youtube_hours, s.gaming_hours,
          s.breaks_per_day, s.coffee_intake_mg, s.exercise_minutes,
          s.assignments_completed, s.attendance_percentage,
          s.stress_level, s.focus_score, s.final_grade,
          s.productivity_score, s.dataset_id
        );
      }
      await query(
        `INSERT INTO students (student_id, age, gender, study_hours_per_day, sleep_hours,
          phone_usage_hours, social_media_hours, youtube_hours, gaming_hours,
          breaks_per_day, coffee_intake_mg, exercise_minutes,
          assignments_completed, attendance_percentage, stress_level,
          focus_score, final_grade, productivity_score, dataset_id)
         VALUES ${batchPlaceholders.join(', ')}`,
        batchValues
      );
    }
    return students.length;
  },

  async findByDataset(datasetId, page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const [dataRes, countRes] = await Promise.all([
      query('SELECT * FROM students WHERE dataset_id = $1 ORDER BY student_id LIMIT $2 OFFSET $3', [datasetId, limit, offset]),
      query('SELECT COUNT(*) as total FROM students WHERE dataset_id = $1', [datasetId])
    ]);
    return {
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].total),
      page,
      totalPages: Math.ceil(parseInt(countRes.rows[0].total) / limit)
    };
  },

  async findAll(datasetId) {
    if (datasetId) {
      const { rows } = await query('SELECT * FROM students WHERE dataset_id = $1 ORDER BY student_id', [datasetId]);
      return rows;
    }
    const { rows } = await query('SELECT * FROM students ORDER BY student_id');
    return rows;
  },

  async deleteByDataset(datasetId) {
    await query('DELETE FROM students WHERE dataset_id = $1', [datasetId]);
  },

  async count(datasetId) {
    const q = datasetId
      ? 'SELECT COUNT(*) as count FROM students WHERE dataset_id = $1'
      : 'SELECT COUNT(*) as count FROM students';
    const params = datasetId ? [datasetId] : [];
    const { rows } = await query(q, params);
    return parseInt(rows[0].count);
  }
};

module.exports = StudentModel;
