import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inscription } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

export default function Inscription() {
  const navigate = useNavigate();
  const { loginCitoyen } = useAuth();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', telephone: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [voirMdp, setVoirMdp] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const res = await inscription(form);
      loginCitoyen(res.data.token, res.data.utilisateur);
      navigate('/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de l\'inscription');
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
            Vos démarches administratives simplifiées
          </h2>
          <p className="text-green-100 mb-8">
            Créez votre compte et accédez à 10 actes administratifs en ligne, sans file d'attente.
          </p>
          <div className="space-y-4">
            {[
              { icon: '📋', text: '10 actes administratifs disponibles' },
              { icon: '📎', text: 'Upload de documents sécurisé' },
              { icon: '📱', text: 'Suivi en temps réel de vos demandes' },
              { icon: '🤖', text: 'Assistant IA disponible 24h/24' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-green-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-green-200 text-xs">
          © 2026 Communauté Urbaine de Douala
        </p>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <FileText size={16} color="white" />
            </div>
            <p className="font-bold text-gray-900">e-Mairie Douala</p>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Créer un compte</h1>
          <p className="text-gray-500 text-sm mb-6">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="text-green-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm flex items-center gap-2">
              ⚠️ {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="nom" value={form.nom} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    placeholder="Nzepang" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="prenom" value={form.prenom} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    placeholder="Soleil" />
                </div>
              </div>
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="telephone" value={form.telephone} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="6XXXXXXXX" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="motDePasse" type={voirMdp ? 'text' : 'password'}
                  value={form.motDePasse} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="Minimum 6 caractères" />
                <button type="button" onClick={() => setVoirMdp(!voirMdp)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {voirMdp ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={chargement}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
              {chargement ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className="text-green-600 hover:underline">conditions d'utilisation</a>
          </p>
        </div>
      </div>
    </div>
  );
}
