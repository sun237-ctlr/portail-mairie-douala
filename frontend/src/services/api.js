import axios from 'axios';

export const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  .replace(/\/$/, '')
  .replace(/\/api$/, '');

const API = axios.create({ baseURL: `${API_ORIGIN}/api` });

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
export const motDePasseOublie = (data) => API.post('/auth/mot-de-passe-oublie', data);
export const reinitialiserMotDePasse = (data) => API.post('/auth/reinitialiser-mot-de-passe', data);
export default API;
