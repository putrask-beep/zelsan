const { StudentModel } = require('../models');
const { descriptiveStats, correlation } = require('../utils/statistics');
const { groupBy } = require('../utils/helpers');

class AnalysisService {
  async getOverview(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return { message: 'No data available' };

    return {
      totalStudents: students.length,
      avgStudyHours: this._avg(students, 'study_hours_per_day'),
      avgSleepHours: this._avg(students, 'sleep_hours'),
      avgProductivity: this._avg(students, 'productivity_score'),
      avgFinalGrade: this._avg(students, 'final_grade'),
      avgFocusScore: this._avg(students, 'focus_score'),
      avgStressLevel: this._avg(students, 'stress_level'),
      avgAttendance: this._avg(students, 'attendance_percentage'),
      avgPhoneUsage: this._avg(students, 'phone_usage_hours'),
      avgGamingHours: this._avg(students, 'gaming_hours'),
      avgSocialMediaHours: this._avg(students, 'social_media_hours'),
      avgExerciseMinutes: this._avg(students, 'exercise_minutes'),
      avgCoffeeIntake: this._avg(students, 'coffee_intake_mg'),
      avgBreaksPerDay: this._avg(students, 'breaks_per_day'),
      avgAssignmentsCompleted: this._avg(students, 'assignments_completed'),
      genderDistribution: this._distribution(students, 'gender'),
      stressDistribution: this._distribution(students, 'stress_level')
    };
  }

  async getKPIs(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return [];

    const avgProductivity = this._avg(students, 'productivity_score');
    const avgAttendance = this._avg(students, 'attendance_percentage');
    const avgFocus = this._avg(students, 'focus_score');
    const totalScreenTime = this._avg(students, 'phone_usage_hours') +
      this._avg(students, 'social_media_hours') +
      this._avg(students, 'youtube_hours') +
      this._avg(students, 'gaming_hours');

    return [
      { name: 'Productivity Score', value: avgProductivity, goal: 50, unit: 'pts', status: avgProductivity >= 50 ? 'good' : 'warning' },
      { name: 'Attendance Rate', value: avgAttendance, goal: 80, unit: '%', status: avgAttendance >= 80 ? 'good' : 'warning' },
      { name: 'Focus Score', value: avgFocus, goal: 60, unit: 'pts', status: avgFocus >= 60 ? 'good' : 'warning' },
      { name: 'Avg Screen Time', value: totalScreenTime, goal: 10, unit: 'hrs', status: totalScreenTime <= 10 ? 'good' : 'warning' }
    ];
  }

  async getCorrelations(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return [];

    const fields = ['study_hours_per_day', 'sleep_hours', 'phone_usage_hours', 'social_media_hours',
      'youtube_hours', 'gaming_hours', 'exercise_minutes', 'coffee_intake_mg',
      'assignments_completed', 'attendance_percentage', 'focus_score', 'final_grade', 'productivity_score'];

    const correlations = [];
    for (let i = 0; i < fields.length; i++) {
      for (let j = i + 1; j < fields.length; j++) {
        const x = students.map((s) => parseFloat(s[fields[i]]) || 0);
        const y = students.map((s) => parseFloat(s[fields[j]]) || 0);
        const corr = correlation(x, y);
        if (Math.abs(corr) > 0.3) {
          correlations.push({ field1: fields[i], field2: fields[j], correlation: corr });
        }
      }
    }
    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }

  async getFieldStats(datasetId, field) {
    const students = await StudentModel.findAll(datasetId);
    const values = students.map((s) => parseFloat(s[field])).filter((v) => !isNaN(v));
    return { field, stats: descriptiveStats(values) };
  }

  async getDistribution(datasetId, field, bins = 10) {
    const students = await StudentModel.findAll(datasetId);
    const values = students.map((s) => parseFloat(s[field])).filter((v) => !isNaN(v));
    if (!values.length) return { field, bins: [] };

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins || 1;
    const result = Array.from({ length: bins }, (_, i) => ({
      range: `${(min + i * binSize).toFixed(1)} - ${(min + (i + 1) * binSize).toFixed(1)}`,
      count: 0
    }));

    values.forEach((v) => {
      const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
      result[idx].count++;
    });
    return { field, bins: result };
  }

  async getComparison(datasetId, groupByField, metricField) {
    const students = await StudentModel.findAll(datasetId);
    const grouped = groupBy(students, groupByField);
    return Object.entries(grouped).map(([key, items]) => ({
      group: key,
      count: items.length,
      avg: this._avg(items, metricField),
      min: Math.min(...items.map((s) => parseFloat(s[metricField]) || 0)),
      max: Math.max(...items.map((s) => parseFloat(s[metricField]) || 0))
    }));
  }

  _avg(arr, field) {
    if (!arr.length) return 0;
    return arr.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0) / arr.length;
  }

  _distribution(arr, field) {
    const dist = {};
    arr.forEach((item) => { const val = item[field]; dist[val] = (dist[val] || 0) + 1; });
    return Object.entries(dist).map(([key, count]) => ({ label: key, count }));
  }
}

module.exports = new AnalysisService();
