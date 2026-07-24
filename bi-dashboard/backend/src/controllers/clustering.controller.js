const clusteringService = require('../services/clustering.service');

exports.runClustering = async (req, res, next) => {
  try {
    const { datasetId, k, features } = req.body;
    const result = await clusteringService.runClustering(datasetId, k, features);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getClusterHistory = async (req, res, next) => {
  try {
    const data = await clusteringService.getClusterHistory(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getClusterById = async (req, res, next) => {
  try {
    const data = await clusteringService.getClusterById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getClusterVisualization = async (req, res, next) => {
  try {
    const data = await clusteringService.getClusterVisualization(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
