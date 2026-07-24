const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const records = [];
    const parser = fs.createReadStream(filePath).pipe(
      parse({ columns: true, skip_empty_lines: true, trim: true, cast: true })
    );
    parser.on('data', (record) => records.push(record));
    parser.on('end', () => resolve(records));
    parser.on('error', reject);
  });
};

const detectColumns = (records) => {
  if (!records.length) return [];
  const keys = Object.keys(records[0]);
  return keys.map((key) => {
    const sampleValues = records.slice(0, 100).map((r) => r[key]);
    const numericCount = sampleValues.filter((v) => !isNaN(parseFloat(v))).length;
    return {
      name: key,
      type: numericCount > sampleValues.length * 0.8 ? 'number' : 'string'
    };
  });
};

module.exports = { parseCSV, detectColumns };
