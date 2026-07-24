const euclideanDistance = (a, b) => {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - (b[i] || 0), 2), 0));
};

const initializeCentroids = (data, k) => {
  const centroids = [];
  const used = new Set();
  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * data.length);
    if (!used.has(idx)) {
      used.add(idx);
      centroids.push([...data[idx]]);
    }
  }
  return centroids;
};

const assignClusters = (data, centroids) => {
  return data.map((point) => {
    let minDist = Infinity;
    let cluster = 0;
    centroids.forEach((centroid, i) => {
      const dist = euclideanDistance(point, centroid);
      if (dist < minDist) {
        minDist = dist;
        cluster = i;
      }
    });
    return cluster;
  });
};

const updateCentroids = (data, assignments, k, dimensions) => {
  const newCentroids = Array.from({ length: k }, () => Array(dimensions).fill(0));
  const counts = Array(k).fill(0);

  data.forEach((point, i) => {
    const cluster = assignments[i];
    counts[cluster]++;
    point.forEach((val, j) => {
      newCentroids[cluster][j] += val;
    });
  });

  return newCentroids.map((centroid, i) =>
    counts[i] > 0 ? centroid.map((v) => v / counts[i]) : centroid
  );
};

const calculateInertia = (data, assignments, centroids) => {
  return data.reduce((sum, point, i) => {
    const centroid = centroids[assignments[i]];
    return sum + Math.pow(euclideanDistance(point, centroid), 2);
  }, 0);
};

const calculateSilhouette = (data, assignments, k) => {
  let totalScore = 0;
  const n = data.length;
  if (n <= 1 || k <= 1) return 0;

  for (let i = 0; i < n; i++) {
    const clusterI = assignments[i];
    const sameCluster = data.filter((_, j) => j !== i && assignments[j] === clusterI);
    const a = sameCluster.length > 0
      ? sameCluster.reduce((sum, p) => sum + euclideanDistance(data[i], p), 0) / sameCluster.length
      : 0;

    let minB = Infinity;
    for (let c = 0; c < k; c++) {
      if (c === clusterI) continue;
      const otherCluster = data.filter((_, j) => assignments[j] === c);
      if (otherCluster.length === 0) continue;
      const b = otherCluster.reduce((sum, p) => sum + euclideanDistance(data[i], p), 0) / otherCluster.length;
      if (b < minB) minB = b;
    }

    if (minB === Infinity) minB = 0;
    const sil = (minB - a) / Math.max(a, minB);
    totalScore += sil;
  }

  return totalScore / n;
};

const calculateCalinskiHarabasz = (data, assignments, centroids, k) => {
  const n = data.length;
  const dims = data[0].length;
  const globalMean = Array(dims).fill(0);
  data.forEach((p) => p.forEach((v, j) => globalMean[j] += v));
  globalMean.forEach((_, j) => globalMean[j] /= n);

  let betweenSS = 0;
  let withinSS = 0;
  const counts = Array(k).fill(0);

  data.forEach((point, i) => {
    counts[assignments[i]]++;
  });

  centroids.forEach((centroid, c) => {
    betweenSS += counts[c] * Math.pow(euclideanDistance(centroid, globalMean), 2);
  });

  data.forEach((point, i) => {
    withinSS += Math.pow(euclideanDistance(point, centroids[assignments[i]]), 2);
  });

  return withinSS > 0 ? (betweenSS / (k - 1)) / (withinSS / (n - k)) : 0;
};

const kmeans = (data, k, maxIterations = 100) => {
  if (!data.length || !data[0].length) {
    throw new Error('Invalid data for clustering');
  }
  const dimensions = data[0].length;
  let centroids = initializeCentroids(data, k);
  let assignments = assignClusters(data, centroids);

  for (let iter = 0; iter < maxIterations; iter++) {
    centroids = updateCentroids(data, assignments, k, dimensions);
    const newAssignments = assignClusters(data, centroids);
    if (JSON.stringify(newAssignments) === JSON.stringify(assignments)) break;
    assignments = newAssignments;
  }

  const inertia = calculateInertia(data, assignments, centroids);
  const silhouette = calculateSilhouette(data, assignments, k);
  const calinskiHarabasz = calculateCalinskiHarabasz(data, assignments, centroids, k);

  return { assignments, centroids, inertia, silhouette, calinskiHarabasz };
};

const elbowMethod = (data, maxK = 10) => {
  const results = [];
  for (let k = 1; k <= Math.min(maxK, data.length); k++) {
    const { inertia } = kmeans(data, k, 50);
    results.push({ k, inertia });
  }
  return results;
};

module.exports = { kmeans, elbowMethod, euclideanDistance };
