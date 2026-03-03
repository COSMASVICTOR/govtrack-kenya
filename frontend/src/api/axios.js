import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('govtrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Documents
export const getMyDocuments = () => API.get('/documents/my');
export const trackDocument = (docNumber) => API.get(`/documents/track/${docNumber}`);

// Lost Reports
export const submitLostReport = (data) => API.post('/lost-reports', data);
export const getMyLostReports = () => API.get('/lost-reports/my');

// Found Items
export const getFoundItems = (params) => API.get('/found-items', { params });
export const reportFoundItem = (data) => API.post('/found-items/report', data);
export const getFoundItemsPublic = (query) => API.get(`/found-items/public?query=${query}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminDocuments = () => API.get('/admin/documents');
export const updateDocumentStatus = (id, status) => API.patch(`/admin/documents/${id}/status`, { status });
export const getAdminLostReports = () => API.get('/admin/lost-reports');
export const getAdminFoundItems = () => API.get('/admin/found-items');
export const logFoundItem = (data) => API.post('/admin/found-items', data);
export const updateFoundItemStatus = (id, status) => API.patch(`/admin/found-items/${id}/status`, { status });
export const getAdminUsers = () => API.get('/admin/users');

export default API;
