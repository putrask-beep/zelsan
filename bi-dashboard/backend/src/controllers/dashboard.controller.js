const dashboardService = require('../services/dashboard.service');

exports.getDashboardData = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getActivityData = async (req, res, next) => {
  try {
    const data = await dashboardService.getActivityData(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getEnergyData = async (req, res, next) => {
  try {
    const data = await dashboardService.getEnergyData(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getKPIData = async (req, res, next) => {
  try {
    const data = await dashboardService.getKPIData(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getCorrelationData = async (req, res, next) => {
  try {
    const data = await dashboardService.getCorrelationData(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
