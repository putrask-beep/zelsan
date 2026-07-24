import api from './axios';

export const getDashboardData = (datasetId) => api.get('/dashboard', { params: { datasetId } });
export const getActivityData = (datasetId) => api.get('/dashboard/activity', { params: { datasetId } });
export const getEnergyData = (datasetId) => api.get('/dashboard/energy', { params: { datasetId } });
export const getKPIData = (datasetId) => api.get('/dashboard/kpis', { params: { datasetId } });
export const getCorrelationData = (datasetId) => api.get('/dashboard/correlations', { params: { datasetId } });
