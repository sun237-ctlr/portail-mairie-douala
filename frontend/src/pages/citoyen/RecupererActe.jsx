import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { verifierParCode } from '../../services/api';

const statutConfig = {
  EN_ATTENTE: { label: 'En attente de traitement', couleur: 'bg-yellow-50 border-yellow-200 text-yellow-800', Icon: Clock },
  VERIFICATION_EN_COURS: { label: 'En cours de vérification', couleur: 'bg-blue-50 border-blue-200 text-blue-800', Icon: Clock },
  ACCEPTE: { label: 'Accepté — Rendez-vous programmé', couleur: 'bg-green-50 border-green-200 text-green-800', Icon: CheckCircle },
  REJETE: { label: 'Rejeté', couleur: 'bg-red-50 border-red-200 text-red-800', Icon: XCircle },
  RENDEZ_VOUS_PROGRAMME: { label: 'Rendez-vous programmé', couleur: 'bg-purple-50 border-purple-200 text-purple-800', Icon: CheckCircle },
  ACTE_DISPONIBLE: { label: '🎉 Votre acte est disponible à la mairie !', couleur: 'bg-green-50 border-green-200 text-green-800', Icon: CheckCircle },
};

export default function RecupererActe() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (searchParams.get('code')) handleRecherche(searchParams.get('code'));
  }, []);

  const handleRecherche = async (codeParam) => {
    const recherche = (codeParam || code).trim().toUpperCase();
    if (!recherche) { setErreur('Veuillez entrer un code'); return; }
    setErreur('');
    setResultat(null);
    setChargement(true);
    try {
      const res = await verifierParCode(recherche);
      setResultat(res.data.demande);
    } catch {
      setErreur('Aucune demande trouvée avec ce code. Vérifiez votre code de suivi.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vérifier mon acte</h1>
          <p className="text-gray-500">
            Entrez votre code de suivi reçu par email pour vérifier si votre acte est disponible
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-green-600" />
            <p className="font-semibold text-gray-800">Entrez votre code de suivi</p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code de suivi *</label>
          <div className="flex gap-3">
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleRecherche()}
              placeholder="Ex : AB3XY7KP"
              maxLength={8}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono tracking-widest text-center text-lg uppercase"
            />
            <button onClick={() => handleRecherche()} disabled={chargement}
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2 text-sm disabled:opacity-50">
              <Search size={15} /> {chargement ? '...' : 'Vérifier'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Code à 8 caractères reçu par email lors de votre demande
          </p>
        </div>

        {/* Erreur */}
        {erreur && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{erreur}</p>
          </div>
        )}

        {/* Résultat */}
        {resultat && (() => {
          const config = statutConfig[resultat.statut] || {};
          const Icon = config.Icon || FileText;
          return (
            <div className={`border-2 rounded-2xl p-6 mb-6 ${config.couleur}`}>
              <div className="flex items-center gap-3 mb-4">
                <Icon size={28} />
                <div>
                  <p className="font-bold text-lg">{config.label}</p>
                  <p className="text-sm opacity-80">{resultat.typeActe.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm bg-white bg-opacity-50 rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="opacity-70">Demandeur</span>
                  <span className="font-semibold">{resultat.utilisateur?.prenom} {resultat.utilisateur?.nom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Code de suivi</span>
                  <span className="font-mono font-bold tracking-widest">{resultat.codeUnique}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Date de soumission</span>
                  <span className="font-medium">{new Date(resultat.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {resultat.dateRendezVous && (
                  <div className="flex justify-between">
                    <span className="opacity-70">📅 Rendez-vous</span>
                    <span className="font-semibold">{new Date(resultat.dateRendezVous).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {resultat.dateDisponibilite && (
                  <div className="flex justify-between">
                    <span className="opacity-70">🎉 Disponible à partir du</span>
                    <span className="font-bold text-green-700">{new Date(resultat.dateDisponibilite).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {resultat.raisonRejet && (
                  <div className="mt-2 bg-red-50 rounded-xl p-3">
                    <p className="font-medium text-red-700 mb-1">Motif de rejet :</p>
                    <p className="text-red-600">{resultat.raisonRejet}</p>
                  </div>
                )}
              </div>

              {resultat.statut === 'ACTE_DISPONIBLE' && (
                <div className="mt-4 bg-green-700 text-white rounded-xl p-4 text-center">
                  <p className="font-bold mb-1">✅ Votre acte est prêt !</p>
                  <p className="text-sm text-green-100">Présentez-vous à votre mairie avec votre CNI originale.</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-blue-600" />
            <p className="font-semibold text-blue-800">Où trouver mon code de suivi ?</p>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            {[
              'Le code vous a été envoyé par email lors de votre demande',
              'Il figure également dans "Mes Demandes" si vous êtes connecté',
              'Format : 8 caractères (lettres et chiffres)',
              'En cas de perte, connectez-vous à votre espace pour le retrouver',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center gap-3">
          <Link to="/connexion"
            className="border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
            Se connecter
          </Link>
          <Link to="/aide"
            className="border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
            Centre d'aide
          </Link>
        </div>
      </div>
    </div>
  );
}
