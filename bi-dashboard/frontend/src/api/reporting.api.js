import api from './axios';

export const getReportData = (datasetId) => api.get('/reporting/data', { params: { datasetId } });
export const downloadPDF = (datasetId) => api.get('/reporting/pdf', { params: { datasetId }, responseType: 'blob' });
export const downloadExcel = (datasetId) => api.get('/reporting/excel', { params: { datasetId }, responseType: 'blob' });
