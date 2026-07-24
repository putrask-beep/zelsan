const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const median = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const stdDev = (arr) => {
  const avg = mean(arr);
  return Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / arr.length);
};

const variance = (arr) => {
  const avg = mean(arr);
  return arr.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / arr.length;
};

const min = (arr) => Math.min(...arr);
const max = (arr) => Math.max(...arr);

const percentile = (arr, p) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
};

const correlation = (x, y) => {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  const meanX = mean(x.slice(0, n));
  const meanY = mean(y.slice(0, n));
  let numerator = 0, denomX = 0, denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : numerator / denom;
};

const descriptiveStats = (arr) => ({
  count: arr.length,
  mean: mean(arr),
  median: median(arr),
  stdDev: stdDev(arr),
  variance: variance(arr),
  min: min(arr),
  max: max(arr),
  q1: percentile(arr, 25),
  q3: percentile(arr, 75),
  range: max(arr) - min(arr)
});

module.exports = { mean, median, stdDev, variance, min, max, percentile, correlation, descriptiveStats };
