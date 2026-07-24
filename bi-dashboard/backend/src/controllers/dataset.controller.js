const integrationService = require('../services/integration.service');

exports.importDataset = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await integrationService.importDataset(req.file, req.user?.id);
    res.status(201).json({ message: 'Dataset imported', data: result });
  } catch (err) {
    next(err);
  }
};

exports.getDatasets = async (req, res, next) => {
  try {
    const datasets = await integrationService.getDatasets();
    res.json(datasets);
  } catch (err) {
    next(err);
  }
};

exports.getDatasetById = async (req, res, next) => {
  try {
    const dataset = await integrationService.getDatasetById(req.params.id);
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });
    res.json(dataset);
  } catch (err) {
    next(err);
  }
};

exports.deleteDataset = async (req, res, next) => {
  try {
    await integrationService.deleteDataset(req.params.id);
    res.json({ message: 'Dataset deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getDatasetStudents = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await integrationService.getDatasetStudents(req.params.id, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (err) {
    next(err);
  }
};
