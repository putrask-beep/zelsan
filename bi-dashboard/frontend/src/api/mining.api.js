import api from './axios';

export const getInsights = (datasetId) => api.get('/mining/insights', { params: { datasetId } });
export const getCorrelationMatrix = (datasetId) => api.get('/mining/correlation-matrix', { params: { datasetId } });
export const getFeatureImportance = (datasetId) => api.get('/mining/feature-importance', { params: { datasetId } });
