const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { StudentModel, DatasetModel, ClusterModel } = require('../models');

class ReportingService {
  async generatePDF(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    const dataset = datasetId ? await DatasetModel.findById(datasetId) : null;
    if (!students.length) throw new Error('No data available');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('Student Productivity & Distraction Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
      if (dataset) doc.text(`Dataset: ${dataset.name} (${students.length} records)`, { align: 'center' });
      doc.moveDown(2);

      const stats = this._calcStats(students);
      doc.fontSize(14).fillColor('#000').text('Executive Summary');
      doc.moveDown();
      doc.fontSize(10).fillColor('#333');
      [
        `Total Students: ${stats.total}`,
        `Average Study Hours: ${stats.avgStudy.toFixed(2)} hrs/day`,
        `Average Productivity Score: ${stats.avgProductivity.toFixed(2)}`,
        `Average Final Grade: ${stats.avgGrade.toFixed(2)}`,
        `Average Focus Score: ${stats.avgFocus.toFixed(2)}`,
        `Average Screen Time: ${stats.avgScreenTime.toFixed(2)} hrs/day`,
        `High Performers (>=70): ${stats.highPerformers}`,
        `Low Performers (<40): ${stats.lowPerformers}`
      ].forEach((item) => doc.text(`  * ${item}`));
      doc.moveDown(2);

      doc.fontSize(14).fillColor('#000').text('Key Insights');
      doc.moveDown();
      doc.fontSize(10).fillColor('#333');
      [
        `Study hours correlate with productivity (r=${stats.studyProductivityCorr.toFixed(3)})`,
        `Screen time correlates with productivity (r=${stats.screenProductivityCorr.toFixed(3)})`,
        `Exercise correlates with focus (r=${stats.exerciseCorr.toFixed(3)})`
      ].forEach((i) => doc.text(`  * ${i}`));

      doc.end();
    });
  }

  async generateExcel(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) throw new Error('No data available');

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BI Dashboard';

    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    const stats = this._calcStats(students);
    [
      { metric: 'Total Students', value: stats.total },
      { metric: 'Avg Study Hours', value: stats.avgStudy.toFixed(2) },
      { metric: 'Avg Productivity', value: stats.avgProductivity.toFixed(2) },
      { metric: 'Avg Final Grade', value: stats.avgGrade.toFixed(2) },
      { metric: 'Avg Focus Score', value: stats.avgFocus.toFixed(2) },
      { metric: 'Avg Screen Time', value: stats.avgScreenTime.toFixed(2) }
    ].forEach((row) => summarySheet.addRow(row));

    const dataSheet = workbook.addWorksheet('Student Data');
    dataSheet.columns = [
      { header: 'Student ID', key: 'student_id', width: 12 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Study Hours', key: 'study_hours_per_day', width: 12 },
      { header: 'Sleep Hours', key: 'sleep_hours', width: 12 },
      { header: 'Phone Usage', key: 'phone_usage_hours', width: 12 },
      { header: 'Productivity', key: 'productivity_score', width: 12 },
      { header: 'Final Grade', key: 'final_grade', width: 12 },
      { header: 'Focus Score', key: 'focus_score', width: 12 },
      { header: 'Stress Level', key: 'stress_level', width: 12 }
    ];
    students.forEach((s) => dataSheet.addRow(s));

    return workbook.xlsx.writeBuffer();
  }

  async getReportData(datasetId) {
    const students = await StudentModel.findAll(datasetId);
    if (!students.length) return null;
    const stats = this._calcStats(students);
    const clusters = await ClusterModel.findByDataset(datasetId);
    return {
      summary: stats,
      clusters: clusters.length ? clusters[0].clusters : [],
      generatedAt: new Date()
    };
  }

  _calcStats(students) {
    const corr = require('../utils/statistics').correlation;
    const total = students.length;
    const avg = (arr, f) => arr.reduce((s, i) => s + (parseFloat(i[f]) || 0), 0) / arr.length;
    const screenTime = (s) => parseFloat(s.phone_usage_hours) + parseFloat(s.social_media_hours) + parseFloat(s.youtube_hours) + parseFloat(s.gaming_hours);

    return {
      total,
      avgStudy: avg(students, 'study_hours_per_day'),
      avgSleep: avg(students, 'sleep_hours'),
      avgProductivity: avg(students, 'productivity_score'),
      avgGrade: avg(students, 'final_grade'),
      avgFocus: avg(students, 'focus_score'),
      avgScreenTime: avg(students, 'phone_usage_hours') + avg(students, 'social_media_hours') + avg(students, 'youtube_hours') + avg(students, 'gaming_hours'),
      highPerformers: students.filter((s) => parseFloat(s.productivity_score) >= 70).length,
      lowPerformers: students.filter((s) => parseFloat(s.productivity_score) < 40).length,
      genderDist: this._dist(students, 'gender'),
      stressDist: this._dist(students, 'stress_level'),
      studyProductivityCorr: corr(students.map((s) => parseFloat(s.study_hours_per_day)), students.map((s) => parseFloat(s.productivity_score))),
      screenProductivityCorr: corr(students.map(screenTime), students.map((s) => parseFloat(s.productivity_score))),
      exerciseCorr: corr(students.map((s) => parseFloat(s.exercise_minutes)), students.map((s) => parseFloat(s.focus_score)))
    };
  }

  _dist(arr, field) {
    const d = {};
    arr.forEach((i) => { d[i[field]] = (d[i[field]] || 0) + 1; });
    return Object.entries(d).map(([label, count]) => ({ label: String(label), count }));
  }
}

module.exports = new ReportingService();
