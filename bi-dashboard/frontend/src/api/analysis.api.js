import api from './axios';

export const getOverview = (datasetId) => api.get('/analysis/overview', { params: { datasetId } });
export const getKPIs = (datasetId) => api.get('/analysis/kpis', { params: { datasetId } });
export const getCorrelations = (datasetId) => api.get('/analysis/correlations', { params: { datasetId } });
export const getFieldStats = (datasetId, field) => api.get(`/analysis/field/${field}`, { params: { datasetId } });
export const getDistribution = (datasetId, field, bins) => api.get(`/analysis/distribution/${field}`, { params: { datasetId, bins } });
export const getComparison = (datasetId, groupBy, metric) => api.get('/analysis/comparison', { params: { datasetId, groupBy, metric } });
