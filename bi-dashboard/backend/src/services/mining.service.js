const { StudentModel } = require('../models');
const { correlation } = require('../utils/statistics');

class MiningService {
  async getPatternInsights(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return { message: 'No data' };

    const insights = [];
    const hp = students.filter((s) => parseFloat(s.productivity_score) >= 70);
    const lp = students.filter((s) => parseFloat(s.productivity_score) < 40);

    if (hp.length) {
      insights.push({
        type: 'high_performers', label: 'High Performers Profile',
        count: hp.length, percentage: ((hp.length / students.length) * 100).toFixed(1),
        avgStudyHours: this._avg(hp, 'study_hours_per_day'),
        avgSleepHours: this._avg(hp, 'sleep_hours'),
        avgPhoneUsage: this._avg(hp, 'phone_usage_hours'),
        avgExercise: this._avg(hp, 'exercise_minutes'),
        avgFocusScore: this._avg(hp, 'focus_score')
      });
    }

    if (lp.length) {
      insights.push({
        type: 'low_performers', label: 'Low Performers Profile',
        count: lp.length, percentage: ((lp.length / students.length) * 100).toFixed(1),
        avgStudyHours: this._avg(lp, 'study_hours_per_day'),
        avgSleepHours: this._avg(lp, 'sleep_hours'),
        avgPhoneUsage: this._avg(lp, 'phone_usage_hours'),
        avgExercise: this._avg(lp, 'exercise_minutes'),
        avgFocusScore: this._avg(lp, 'focus_score')
      });
    }

    const highScreen = students.filter((s) =>
      (parseFloat(s.phone_usage_hours) + parseFloat(s.social_media_hours) + parseFloat(s.youtube_hours) + parseFloat(s.gaming_hours)) > 12
    );
    insights.push({
      type: 'screen_time_risk', label: 'High Screen Time Risk',
      count: highScreen.length, percentage: ((highScreen.length / students.length) * 100).toFixed(1),
      avgProductivity: this._avg(highScreen, 'productivity_score'),
      avgGrade: this._avg(highScreen, 'final_grade')
    });

    const stressed = students.filter((s) => parseInt(s.stress_level) >= 8);
    insights.push({
      type: 'high_stress', label: 'High Stress Students',
      count: stressed.length, percentage: ((stressed.length / students.length) * 100).toFixed(1),
      avgProductivity: this._avg(stressed, 'productivity_score'),
      avgFocus: this._avg(stressed, 'focus_score'),
      avgSleep: this._avg(stressed, 'sleep_hours')
    });

    return { insights, totalStudents: students.length };
  }

  async getCorrelationMatrix(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return [];

    const fields = ['study_hours_per_day', 'sleep_hours', 'phone_usage_hours',
      'social_media_hours', 'youtube_hours', 'gaming_hours', 'exercise_minutes',
      'coffee_intake_mg', 'assignments_completed', 'attendance_percentage',
      'stress_level', 'focus_score', 'final_grade', 'productivity_score'];

    const matrix = fields.map((f1) =>
      fields.map((f2) => ({
        field1: f1, field2: f2,
        value: correlation(
          students.map((s) => parseFloat(s[f1]) || 0),
          students.map((s) => parseFloat(s[f2]) || 0)
        )
      }))
    );
    return { fields, matrix };
  }

  async getFeatureImportance(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return [];

    const target = students.map((s) => parseFloat(s.productivity_score) || 0);
    const features = ['study_hours_per_day', 'sleep_hours', 'phone_usage_hours',
      'social_media_hours', 'youtube_hours', 'gaming_hours', 'exercise_minutes',
      'coffee_intake_mg', 'assignments_completed', 'attendance_percentage',
      'stress_level', 'focus_score'];

    return features.map((f) => {
      const values = students.map((s) => parseFloat(s[f]) || 0);
      const corr = correlation(values, target);
      return { feature: f, importance: Math.abs(corr), direction: corr > 0 ? 'positive' : 'negative' };
    }).sort((a, b) => b.importance - a.importance);
  }

  _avg(arr, field) {
    if (!arr.length) return 0;
    return arr.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0) / arr.length;
  }
}

module.exports = new MiningService();
