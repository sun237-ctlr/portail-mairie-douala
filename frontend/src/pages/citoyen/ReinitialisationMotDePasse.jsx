import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, FileText, CheckCircle } from 'lucide-react';
import API from '../../services/api';

export default function ReinitialisationMotDePasse() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (motDePasse !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas');
      return;
    }
    if (motDePasse.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setChargement(true);
    try {
      await API.post('/auth/reinitialiser-mot-de-passe', { token, nouveauMotDePasse: motDePasse });
      setSucces(true);
    } catch {
      setErreur('Lien invalide ou expiré. Veuillez recommencer.');
    } finally {
      setChargement(false);
    }
  };

  if (succes) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mot de passe modifié !</h2>
        <p className="text-gray-500 mb-6">Votre mot de passe a été réinitialisé avec succès.</p>
        <Link to="/connexion" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition block text-center">
          Se connecter
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <FileText size={16} color="white" />
          </div>
          <p className="font-bold text-gray-900">e-Mairie Douala</p>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Nouveau mot de passe</h1>
        <p className="text-gray-500 text-sm mb-6">Choisissez un nouveau mot de passe sécurisé</p>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe *</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={voir ? 'text' : 'password'} value={motDePasse}
                onChange={e => setMotDePasse(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Minimum 6 caractères" />
              <button type="button" onClick={() => setVoir(!voir)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {voir ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={voir ? 'text' : 'password'} value={confirmation}
                onChange={e => setConfirmation(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Répétez le mot de passe" />
            </div>
          </div>
          <button type="submit" disabled={chargement}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {chargement ? 'Modification...' : 'Modifier mon mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}
