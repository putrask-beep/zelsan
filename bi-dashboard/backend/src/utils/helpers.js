const formatNumber = (num, decimals = 2) => {
  return Number(num).toFixed(decimals);
};

const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const val = typeof key === 'function' ? key(item) : item[key];
    (acc[val] = acc[val] || []).push(item);
    return acc;
  }, {});
};

const paginate = (arr, page = 1, limit = 20) => {
  const start = (page - 1) * limit;
  return {
    data: arr.slice(start, start + limit),
    total: arr.length,
    page,
    totalPages: Math.ceil(arr.length / limit)
  };
};

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

module.exports = { formatNumber, groupBy, paginate, clamp, mapRange };
