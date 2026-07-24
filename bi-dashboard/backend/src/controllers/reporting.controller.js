const reportingService = require('../services/reporting.service');

exports.generatePDF = async (req, res, next) => {
  try {
    const buffer = await reportingService.generatePDF(req.query.datasetId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bi-report.pdf');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

exports.generateExcel = async (req, res, next) => {
  try {
    const buffer = await reportingService.generateExcel(req.query.datasetId);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=bi-report.xlsx');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};

exports.getReportData = async (req, res, next) => {
  try {
    const data = await reportingService.getReportData(req.query.datasetId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
