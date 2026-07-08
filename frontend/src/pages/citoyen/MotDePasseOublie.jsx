import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, FileText, CheckCircle } from 'lucide-react';
import API from '../../services/api';

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChargement(true);
    try {
      await API.post('/auth/mot-de-passe-oublie', { email });
      setEnvoye(true);
    } catch {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setChargement(false);
    }
  };

  if (envoye) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Email envoyé !</h2>
        <p className="text-gray-500 mb-2">Si l'adresse <strong>{email}</strong> est associée à un compte, vous recevrez un lien de réinitialisation.</p>
        <p className="text-gray-400 text-sm mb-6">Vérifiez aussi vos spams.</p>
        <Link to="/connexion" className="text-green-600 font-semibold hover:underline text-sm">
          Retour à la connexion
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Mot de passe oublié</h1>
        <p className="text-gray-500 text-sm mb-6">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {message && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email *</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="exemple@gmail.com" />
            </div>
          </div>
          <button type="submit" disabled={chargement}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50">
            {chargement ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/connexion" className="text-green-600 font-semibold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
