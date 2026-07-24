const removeNulls = (records) => {
  return records.filter((r) =>
    Object.values(r).every((v) => v !== null && v !== undefined && v !== '')
  );
};

const removeDuplicates = (records, keyField) => {
  const seen = new Set();
  return records.filter((r) => {
    const key = keyField ? r[keyField] : JSON.stringify(r);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const castTypes = (records, columns) => {
  return records.map((r) => {
    const cleaned = { ...r };
    columns.forEach((col) => {
      if (col.type === 'number') {
        const val = parseFloat(cleaned[col.name]);
        cleaned[col.name] = isNaN(val) ? 0 : val;
      }
    });
    return cleaned;
  });
};

const winsorize = (records, field, percentile = 0.01) => {
  const values = records.map((r) => r[field]).filter((v) => !isNaN(v)).sort((a, b) => a - b);
  if (!values.length) return records;
  const lowerIdx = Math.floor(values.length * percentile);
  const upperIdx = Math.floor(values.length * (1 - percentile));
  const lower = values[lowerIdx];
  const upper = values[upperIdx];
  return records.map((r) => {
    const val = parseFloat(r[field]);
    if (isNaN(val)) return r;
    return { ...r, [field]: Math.min(upper, Math.max(lower, val)) };
  });
};

const cleanDataset = (records, columns) => {
  let cleaned = removeNulls(records);
  cleaned = castTypes(cleaned, columns);
  const numericCols = columns.filter((c) => c.type === 'number').map((c) => c.name);
  numericCols.forEach((col) => {
    cleaned = winsorize(cleaned, col);
  });
  return cleaned;
};

module.exports = { removeNulls, removeDuplicates, castTypes, winsorize, cleanDataset };
