import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connexion } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLangue } from '../../context/LangueContext';
import { FileText, Mail, Lock, Eye, EyeOff, CheckCircle, Clock, CheckSquare } from 'lucide-react';
import BoutonLangue from '../../components/BoutonLangue';

export default function Connexion() {
  const navigate = useNavigate();
  const { loginCitoyen } = useAuth();
  const { t } = useLangue();
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
      <div className="hidden md:flex flex-col justify-between w-2/5 p-10 text-white"
        style={{ background: 'linear-gradient(160deg, #16a34a 0%, #15803d 50%, #a3e635 100%)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FileText size={18} color="white" />
            </div>
            <div>
              <p className="font-bold leading-tight">e-Mairie Douala</p>
              <p className="text-green-200 text-xs">Ville de Douala</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">{t.bienvenue}</h2>
          <p className="text-green-100 mb-8">{t.descConnexion}</p>
          <div className="bg-white bg-opacity-10 rounded-2xl p-5 space-y-3">
            {[
              { Icon: CheckCircle, couleur: 'text-green-300', statut: t.statutAccepte, acte: t.acteNaissance },
              { Icon: Clock, couleur: 'text-yellow-300', statut: t.statutEnAttente, acte: t.certResidence },
              { Icon: CheckSquare, couleur: 'text-blue-300', statut: t.statutDisponible, acte: t.certVie },
            ].map(({ Icon, couleur, statut, acte }) => (
              <div key={acte} className="flex justify-between items-center bg-white bg-opacity-10 rounded-xl px-4 py-3">
                <span className="text-sm text-white">{acte}</span>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${couleur}`}>
                  <Icon size={13} /> {statut}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-green-200 text-xs">© 2026 Communauté Urbaine de Douala</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText size={16} color="white" />
              </div>
              <p className="font-bold text-gray-900">e-Mairie Douala</p>
            </div>
            <div className="ml-auto">
              <BoutonLangue />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.connexion}</h1>
          <p className="text-gray-500 text-sm mb-6">
            {t.pasDeCompte}{' '}
            <Link to="/inscription" className="text-green-600 font-semibold hover:underline">
              {t.sInscrireGratuitement}
            </Link>
          </p>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.adresseEmail} *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  placeholder="exemple@gmail.com" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">{t.motDePasse} *</label>
                <Link to="/mot-de-passe-oublie" className="text-xs text-green-600 hover:underline">{t.motDePasseOublie}</Link>
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
              {chargement ? t.connexionEnCours : t.seConnecterBtn}
            </button>
          </form>

          <div className="border-t border-gray-200 mt-6 pt-4 text-center">
            <Link to="/admin/connexion" className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              {t.accesGestionnaire}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
