const { StudentModel, ClusterModel } = require('../models');
const { kmeans } = require('../utils/kmeans');

const DEFAULT_FEATURES = [
  'study_hours_per_day', 'sleep_hours', 'phone_usage_hours', 'social_media_hours',
  'youtube_hours', 'gaming_hours', 'exercise_minutes', 'coffee_intake_mg',
  'assignments_completed', 'attendance_percentage', 'focus_score', 'productivity_score'
];

const CLUSTER_LABELS = {
  0: 'Low Performer',
  1: 'Distracted Student',
  2: 'Balanced Student',
  3: 'High Performer'
};

class ClusteringService {
  async runClustering(datasetId, k = 4, features = DEFAULT_FEATURES) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) throw new Error('No data available for clustering');

    const data = students.map((s) => features.map((f) => parseFloat(s[f]) || 0));
    const { assignments, centroids, inertia, silhouette, calinskiHarabasz } = kmeans(data, k);

    const clusterStats = Array.from({ length: k }, (_, i) => {
      const members = students.filter((_, idx) => assignments[idx] === i);
      return {
        clusterId: i,
        label: CLUSTER_LABELS[i] || `Cluster ${i}`,
        count: members.length,
        percentage: ((members.length / students.length) * 100).toFixed(1),
        centroid: centroids[i],
        characteristics: {
          avgStudyHours: this._avg(members, 'study_hours_per_day'),
          avgSleepHours: this._avg(members, 'sleep_hours'),
          avgPhoneUsage: this._avg(members, 'phone_usage_hours'),
          avgSocialMedia: this._avg(members, 'social_media_hours'),
          avgYouTube: this._avg(members, 'youtube_hours'),
          avgGaming: this._avg(members, 'gaming_hours'),
          avgExercise: this._avg(members, 'exercise_minutes'),
          avgProductivity: this._avg(members, 'productivity_score'),
          avgFocusScore: this._avg(members, 'focus_score'),
          avgFinalGrade: this._avg(members, 'final_grade'),
          avgStressLevel: this._avg(members, 'stress_level'),
          avgAttendance: this._avg(members, 'attendance_percentage')
        }
      };
    });

    const results = students.map((s, idx) => ({
      studentIndex: idx,
      studentId: s.student_id,
      cluster: assignments[idx]
    }));

    return ClusterModel.create({
      datasetId,
      name: `Clustering Run (k=${k})`,
      k,
      features,
      algorithm: 'k-means',
      silhouetteScore: silhouette,
      inertia,
      calinskiHarabasz,
      centroids,
      clusters: clusterStats,
      results
    });
  }

  async getClusterHistory(datasetId) {
    return ClusterModel.findByDataset(datasetId);
  }

  async getClusterById(id) {
    return ClusterModel.findById(id);
  }

  async getClusterVisualization(clusterId) {
    const cluster = await ClusterModel.findById(clusterId);
    if (!cluster) throw new Error('Cluster not found');
    const parsed = ClusterModel._parseJSON(cluster);
    return {
      clusters: parsed.clusters,
      features: parsed.features,
      centroids: parsed.centroids,
      metrics: {
        silhouette: parsed.silhouette_score,
        inertia: parsed.inertia,
        calinskiHarabasz: parsed.calinski_harabasz
      }
    };
  }

  _avg(arr, field) {
    if (!arr.length) return 0;
    return arr.reduce((sum, item) => sum + (parseFloat(item[field]) || 0), 0) / arr.length;
  }
}

module.exports = new ClusteringService();
