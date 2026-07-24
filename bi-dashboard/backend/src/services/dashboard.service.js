const StudentModel = require('../models/student.model');
const DatasetModel = require('../models/dataset.model');
const ClusterModel = require('../models/cluster.model');

class DashboardService {
  async getDashboardData(datasetId) {
    const [students, datasets, clusters] = await Promise.all([
      StudentModel.findAll(datasetId),
      DatasetModel.findAll(),
      ClusterModel.findLatest(datasetId)
    ]);

    if (!students.length) {
      return { overview: null, recentDatasets: datasets.slice(0, 5), latestCluster: null };
    }
    return {
      overview: this._buildOverview(students),
      recentDatasets: datasets.slice(0, 5),
      latestCluster: clusters
    };
  }

  async getActivityData(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return null;
    const fields = [
      { db: 'study_hours_per_day', label: 'Study Hours Per Day' },
      { db: 'sleep_hours', label: 'Sleep Hours' },
      { db: 'phone_usage_hours', label: 'Phone Usage Hours' },
      { db: 'social_media_hours', label: 'Social Media Hours' },
      { db: 'youtube_hours', label: 'YouTube Hours' },
      { db: 'gaming_hours', label: 'Gaming Hours' },
      { db: 'exercise_minutes', label: 'Exercise Minutes' }
    ];
    return fields.map((f) => ({
      field: f.db,
      label: f.label,
      avg: this._avg(students, f.db),
      min: Math.min(...students.map((s) => parseFloat(s[f.db]) || 0)),
      max: Math.max(...students.map((s) => parseFloat(s[f.db]) || 0))
    }));
  }

  async getEnergyData(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return null;
    return {
      avgSleepHours: this._avg(students, 'sleep_hours'),
      avgExerciseMinutes: this._avg(students, 'exercise_minutes'),
      avgCoffeeIntake: this._avg(students, 'coffee_intake_mg'),
      avgBreaksPerDay: this._avg(students, 'breaks_per_day'),
      sleepDistribution: this._binnedDist(students.map((s) => parseFloat(s.sleep_hours) || 0)),
      exerciseDistribution: this._binnedDist(students.map((s) => parseFloat(s.exercise_minutes) || 0))
    };
  }

  async getKPIData(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return [];
    const avgProd = this._avg(students, 'productivity_score');
    const avgAtt = this._avg(students, 'attendance_percentage');
    const avgFocus = this._avg(students, 'focus_score');
    const screenTime = this._avg(students, 'phone_usage_hours') + this._avg(students, 'social_media_hours') + this._avg(students, 'youtube_hours') + this._avg(students, 'gaming_hours');
    const avgGrade = this._avg(students, 'final_grade');
    const avgStress = this._avg(students, 'stress_level');

    return [
      { name: 'Productivity', value: avgProd.toFixed(1), target: 50, status: avgProd >= 50 ? 'on-track' : 'below-target', icon: 'TrendingUp' },
      { name: 'Attendance', value: avgAtt.toFixed(1) + '%', target: 80, status: avgAtt >= 80 ? 'on-track' : 'below-target', icon: 'UserCheck' },
      { name: 'Focus Score', value: avgFocus.toFixed(1), target: 60, status: avgFocus >= 60 ? 'on-track' : 'below-target', icon: 'Target' },
      { name: 'Screen Time', value: screenTime.toFixed(1) + 'h', target: 10, status: screenTime <= 10 ? 'on-track' : 'below-target', icon: 'Monitor' },
      { name: 'Avg Grade', value: avgGrade.toFixed(1), target: 70, status: avgGrade >= 70 ? 'on-track' : 'below-target', icon: 'Award' },
      { name: 'Stress Level', value: avgStress.toFixed(1), target: 5, status: avgStress <= 5 ? 'on-track' : 'below-target', icon: 'Activity' }
    ];
  }

  async getCorrelationData(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return [];
    const { correlation } = require('../utils/statistics');
    const pairs = [
      ['study_hours_per_day', 'productivity_score'],
      ['sleep_hours', 'focus_score'],
      ['phone_usage_hours', 'productivity_score'],
      ['social_media_hours', 'final_grade'],
      ['gaming_hours', 'focus_score'],
      ['exercise_minutes', 'productivity_score'],
      ['coffee_intake_mg', 'focus_score'],
      ['stress_level', 'productivity_score'],
      ['attendance_percentage', 'final_grade'],
      ['assignments_completed', 'final_grade']
    ];
    return pairs.map(([f1, f2]) => ({
      field1: f1, field2: f2,
      correlation: correlation(
        students.map((s) => parseFloat(s[f1]) || 0),
        students.map((s) => parseFloat(s[f2]) || 0)
      )
    }));
  }

  _buildOverview(students) {
    return {
      totalStudents: students.length,
      avgProductivity: this._avg(students, 'productivity_score'),
      avgGrade: this._avg(students, 'final_grade'),
      avgFocus: this._avg(students, 'focus_score'),
      avgStudyHours: this._avg(students, 'study_hours_per_day'),
      avgScreenTime: this._avg(students, 'phone_usage_hours') + this._avg(students, 'social_media_hours') + this._avg(students, 'youtube_hours') + this._avg(students, 'gaming_hours'),
      genderDistribution: this._dist(students, 'gender'),
      stressDistribution: this._dist(students, 'stress_level')
    };
  }

  _avg(arr, field) {
    if (!arr.length) return 0;
    return arr.reduce((s, i) => s + (parseFloat(i[field]) || 0), 0) / arr.length;
  }

  _dist(arr, field) {
    const d = {};
    arr.forEach((i) => { d[i[field]] = (d[i[field]] || 0) + 1; });
    return Object.entries(d).map(([label, count]) => ({ label: String(label), count }));
  }

  _binnedDist(values, bins = 8) {
    if (!values.length) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins || 1;
    return Array.from({ length: bins }, (_, i) => ({
      range: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
      count: values.filter((v) => v >= min + i * binSize && v < min + (i + 1) * binSize).length
    }));
  }
}

module.exports = new DashboardService();
