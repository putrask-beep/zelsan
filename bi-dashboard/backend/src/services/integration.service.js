const fs = require('fs');
const path = require('path');
const { DatasetModel, StudentModel } = require('../models');
const { parseCSV, detectColumns } = require('../utils/csvParser');
const { cleanDataset } = require('../utils/dataCleaner');

class IntegrationService {
  async importDataset(file, userId) {
    const ext = path.extname(file.originalname).toLowerCase();

    const dataset = await DatasetModel.create({
      name: path.basename(file.originalname, ext),
      originalFilename: file.originalname,
      storedFilename: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId
    });

    try {
      await DatasetModel.update(dataset.id, { status: 'processing' });

      let records;
      if (ext === '.csv') {
        records = await parseCSV(file.path);
      } else {
        throw new Error('Unsupported file format');
      }

      const columns = detectColumns(records);
      const cleaned = cleanDataset(records, columns);

      await DatasetModel.update(dataset.id, {
        row_count: cleaned.length,
        column_count: columns.length,
        columns: JSON.stringify(columns),
        status: 'ready'
      });

      const students = cleaned.map((r, idx) => ({
        student_id: r.student_id || idx + 1,
        age: r.age || 0,
        gender: r.gender || 'Other',
        study_hours_per_day: r.study_hours_per_day || 0,
        sleep_hours: r.sleep_hours || 0,
        phone_usage_hours: r.phone_usage_hours || 0,
        social_media_hours: r.social_media_hours || 0,
        youtube_hours: r.youtube_hours || 0,
        gaming_hours: r.gaming_hours || 0,
        breaks_per_day: r.breaks_per_day || 0,
        coffee_intake_mg: r.coffee_intake_mg || 0,
        exercise_minutes: r.exercise_minutes || 0,
        assignments_completed: r.assignments_completed || 0,
        attendance_percentage: r.attendance_percentage || 0,
        stress_level: r.stress_level || 5,
        focus_score: r.focus_score || 50,
        final_grade: r.final_grade || 0,
        productivity_score: r.productivity_score || 0,
        dataset_id: dataset.id
      }));

      await StudentModel.bulkCreate(students);

      const updatedDataset = await DatasetModel.findById(dataset.id);
      return { dataset: updatedDataset, studentCount: students.length, columns };
    } catch (err) {
      await DatasetModel.update(dataset.id, { status: 'error' });
      throw err;
    }
  }

  async getDatasets() {
    return DatasetModel.findAll();
  }

  async getDatasetById(id) {
    return DatasetModel.findById(id);
  }

  async deleteDataset(id) {
    const dataset = await DatasetModel.findById(id);
    if (!dataset) throw new Error('Dataset not found');
    await StudentModel.deleteByDataset(id);
    if (fs.existsSync(dataset.file_path)) {
      fs.unlinkSync(dataset.file_path);
    }
    return DatasetModel.delete(id);
  }

  async getDatasetStudents(datasetId, page = 1, limit = 50) {
    return StudentModel.findByDataset(datasetId, page, limit || 50);
  }
}

module.exports = new IntegrationService();
