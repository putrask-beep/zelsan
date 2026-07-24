import api from './axios';

export const getDatasets = () => api.get('/datasets');
export const getDatasetById = (id) => api.get(`/datasets/${id}`);
export const uploadDataset = (formData) => api.post('/datasets/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteDataset = (id) => api.delete(`/datasets/${id}`);
export const getDatasetStudents = (id, page = 1, limit = 50) => api.get(`/datasets/${id}/students?page=${page}&limit=${limit}`);
