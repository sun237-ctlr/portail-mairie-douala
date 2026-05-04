import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const inscription = (formData) => API.post('/auth/inscription', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const connexion = (data) => API.post('/auth/connexion', data);
export const connexionAdmin = (data) => API.post('/auth/admin/connexion', data);
export const getMesDemandes = () => API.get('/demandes/mes-demandes');
export const creerDemande = (data) => API.post('/demandes', data);
export const verifierParCode = (code) => API.get(`/demandes/verifier/${code}`);
export const uploadDocuments = (demandeId, formData) =>
  API.post(`/documents/${demandeId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getDemandesAdmin = (params) => API.get('/admin/demandes', { params });
export const accepterDemande = (id, data) => API.patch(`/admin/demandes/${id}/accepter`, data);
export const rejeterDemande = (id, data) => API.patch(`/admin/demandes/${id}/rejeter`, data);

export default API;
