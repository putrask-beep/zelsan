const analysisService = require('../services/analysis.service');

exports.getOverview = async (req, res, next) => {
  try {
    const data = await analysisService.getOverview(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getKPIs = async (req, res, next) => {
  try {
    const data = await analysisService.getKPIs(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getCorrelations = async (req, res, next) => {
  try {
    const data = await analysisService.getCorrelations(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getFieldStats = async (req, res, next) => {
  try {
    const data = await analysisService.getFieldStats(req.query.datasetId, req.params.field);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getDistribution = async (req, res, next) => {
  try {
    const data = await analysisService.getDistribution(req.query.datasetId, req.params.field, parseInt(req.query.bins));
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getComparison = async (req, res, next) => {
  try {
    const data = await analysisService.getComparison(req.query.datasetId, req.query.groupBy, req.query.metric);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
