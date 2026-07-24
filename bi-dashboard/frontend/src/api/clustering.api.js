import api from './axios';

export const runClustering = (data) => api.post('/clustering/run', data);
export const getClusterHistory = (datasetId) => api.get('/clustering/history', { params: { datasetId } });
export const getClusterById = (id) => api.get(`/clustering/${id}`);
export const getClusterVisualization = (id) => api.get(`/clustering/${id}/visualization`);
