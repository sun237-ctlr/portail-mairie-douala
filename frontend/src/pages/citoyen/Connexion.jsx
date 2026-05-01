import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connexion } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Connexion() {
  const navigate = useNavigate();
  const { loginCitoyen } = useAuth();
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const res = await connexion(form);
      loginCitoyen(res.data.token, res.data.utilisateur);
      navigate('/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-4xl">🏛️</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Connexion</h1>
          <p className="text-gray-500 text-sm">Mairie de Douala — Portail en ligne</p>
        </div>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="exemple@gmail.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <input name="motDePasse" type="password" value={form.motDePasse} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Votre mot de passe" />
          </div>
          <button type="submit" disabled={chargement}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50">
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-green-700 font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
        <div className="border-t mt-4 pt-4 text-center">
          <Link to="/admin/connexion" className="text-xs text-gray-400 hover:text-gray-600">
            Accès gestionnaire mairie →
          </Link>
        </div>
      </div>
    </div>
  );
}
