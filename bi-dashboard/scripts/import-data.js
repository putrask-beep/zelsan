const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { initDB, query } = require('../backend/src/db');
const fs = require('fs');
const { parse } = require('csv-parse');

const importData = async () => {
  try {
    await initDB();
    console.log('PostgreSQL tables ready');

    const csvPath = path.join(__dirname, '../../student_productivity_distraction_dataset_20000.csv');
    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found at:', csvPath);
      process.exit(1);
    }

    const records = [];
    const parser = fs.createReadStream(csvPath).pipe(
      parse({ columns: true, skip_empty_lines: true, trim: true, cast: true })
    );
    parser.on('data', (r) => records.push(r));
    await new Promise((resolve) => parser.on('end', resolve));

    console.log(`Read ${records.length} records from CSV`);

    await query('DELETE FROM students');

    const docs = records.map((r) => ({
      student_id: parseInt(r.student_id),
      age: parseInt(r.age),
      gender: r.gender,
      study_hours_per_day: parseFloat(r.study_hours_per_day) || 0,
      sleep_hours: parseFloat(r.sleep_hours) || 0,
      phone_usage_hours: parseFloat(r.phone_usage_hours) || 0,
      social_media_hours: parseFloat(r.social_media_hours) || 0,
      youtube_hours: parseFloat(r.youtube_hours) || 0,
      gaming_hours: parseFloat(r.gaming_hours) || 0,
      breaks_per_day: parseInt(r.breaks_per_day) || 0,
      coffee_intake_mg: parseFloat(r.coffee_intake_mg) || 0,
      exercise_minutes: parseFloat(r.exercise_minutes) || 0,
      assignments_completed: parseInt(r.assignments_completed) || 0,
      attendance_percentage: parseFloat(r.attendance_percentage) || 0,
      stress_level: parseInt(r.stress_level) || 5,
      focus_score: parseInt(r.focus_score) || 50,
      final_grade: parseFloat(r.final_grade) || 0,
      productivity_score: parseFloat(r.productivity_score) || 0
    }));

    const batchSize = 500;
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      const placeholders = [];
      const values = [];
      let idx = 1;

      batch.forEach((s) => {
        placeholders.push(
          `($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`
        );
        values.push(
          s.student_id, s.age, s.gender,
          s.study_hours_per_day, s.sleep_hours, s.phone_usage_hours,
          s.social_media_hours, s.youtube_hours, s.gaming_hours,
          s.breaks_per_day, s.coffee_intake_mg, s.exercise_minutes,
          s.assignments_completed, s.attendance_percentage,
          s.stress_level, s.focus_score, s.final_grade,
          s.productivity_score
        );
      });

      await query(
        `INSERT INTO students (student_id, age, gender, study_hours_per_day, sleep_hours,
          phone_usage_hours, social_media_hours, youtube_hours, gaming_hours,
          breaks_per_day, coffee_intake_mg, exercise_minutes,
          assignments_completed, attendance_percentage, stress_level,
          focus_score, final_grade, productivity_score)
         VALUES ${placeholders.join(', ')}`,
        values
      );
      console.log(`Inserted ${Math.min(i + batchSize, docs.length)}/${docs.length}`);
    }

    console.log('Import complete!');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
};

importData();
