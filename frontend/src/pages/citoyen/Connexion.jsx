import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connexion } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Connexion() {
  const navigate = useNavigate();
  const { loginCitoyen } = useAuth();
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [voirMdp, setVoirMdp] = useState(false);

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
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <div className="hidden md:flex flex-col justify-between w-2/5 p-10 text-white"
        style={{ background: 'linear-gradient(160deg, #16a34a 0%, #15803d 50%, #a3e635 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <FileText size={18} color="white" />
          </div>
          <div>
            <p className="font-bold leading-tight">e-Mairie Douala</p>
            <p className="text-green-200 text-xs">Ville de Douala</p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Bienvenue sur votre portail administratif
          </h2>
          <p className="text-green-100 mb-8">
            Connectez-vous pour accéder à vos demandes et suivre leur avancement en temps réel.
          </p>
          <div className="bg-white bg-opacity-10 rounded-2xl p-5 space-y-3">
            {[
              { statut: '✅ Acceptée', acte: 'Acte de naissance' },
              { statut: '⏳ En attente', acte: 'Certificat de résidence' },
              { statut: '🎉 Disponible', acte: 'Certificat de vie' },
            ].map((item) => (
              <div key={item.acte} className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl px-4 py-3">
                <span className="text-sm text-white">{item.acte}</span>
                <span className="text-xs text-green-200">{item.statut}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-green-200 text-xs">© 2026 Communauté Urbaine de Douala</p>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <FileText size={16} color="white" />
            </div>
            <p className="font-bold text-gray-900">e-Mairie Douala</p>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Connexion</h1>
          <p className="text-gray-500 text-sm mb-6">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-green-600 font-semibold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
              ⚠️ {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="exemple@gmail.com" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
                <a href="#" className="text-xs text-green-600 hover:underline">Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="motDePasse" type={voirMdp ? 'text' : 'password'}
                  value={form.motDePasse} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="Votre mot de passe" />
                <button type="button" onClick={() => setVoirMdp(!voirMdp)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {voirMdp ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={chargement}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 mt-2">
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="border-t border-gray-200 mt-6 pt-4 text-center">
            <Link to="/admin/connexion" className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              🏛️ Accès gestionnaire mairie →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
