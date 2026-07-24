const miningService = require('../services/mining.service');

exports.getPatternInsights = async (req, res, next) => {
  try {
    const data = await miningService.getPatternInsights(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getCorrelationMatrix = async (req, res, next) => {
  try {
    const data = await miningService.getCorrelationMatrix(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getFeatureImportance = async (req, res, next) => {
  try {
    const data = await miningService.getFeatureImportance(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
