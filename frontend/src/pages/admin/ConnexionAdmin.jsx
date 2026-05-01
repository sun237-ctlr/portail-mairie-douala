import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connexionAdmin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ConnexionAdmin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [form, setForm] = useState({ codeUnique: '', motDePasse: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const res = await connexionAdmin(form);
      loginAdmin(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Code ou mot de passe incorrect');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-4xl">🏛️</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Espace Administrateur</h1>
          <p className="text-gray-500 text-sm">Mairie de Douala — Accès réservé</p>
        </div>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code agent *</label>
            <input name="codeUnique" value={form.codeUnique} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Ex: ADMIN-2025-001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <input name="motDePasse" type="password" value={form.motDePasse} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              placeholder="Mot de passe" />
          </div>
          <button type="submit" disabled={chargement}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50">
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
