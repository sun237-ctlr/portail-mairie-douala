import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDemandeById } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, ArrowLeft, CheckCircle } from 'lucide-react';

export default function DetailDemande() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { utilisateur } = useAuth();
  const [demande, setDemande] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!utilisateur) {
      navigate('/connexion');
      return;
    }

    const fetchDemande = async () => {
      try {
        const res = await getDemandeById(id);
        setDemande(res.data.demande);
      } catch (err) {
        setErreur(err.response?.data?.message || 'Impossible de charger la demande');
      } finally {
        setChargement(false);
      }
    };

    fetchDemande();
  }, [id, utilisateur, navigate]);

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Chargement de la demande...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-md">
          <p className="text-red-600 font-semibold mb-4">{erreur}</p>
          <button onClick={() => navigate('/dashboard')}
            className="bg-green-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-800 transition">
            Retour au tableau
          </button>
        </div>
      </div>
    );
  }

  if (!demande) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-sm text-green-700 font-semibold mb-6 btn-smooth">
          <ArrowLeft size={16} /> Retour aux demandes
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden card">
          <div className="bg-green-700 text-white px-8 py-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase opacity-80">Demande</p>
                <h1 className="text-3xl font-bold mt-2">{demande.typeActe.replace(/_/g, ' ')}</h1>
                <p className="mt-2 text-sm opacity-90">Code unique : <strong>{demande.codeUnique}</strong></p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
                  {demande.statut === 'ACCEPTE' ? <CheckCircle size={16} /> : <FileText size={16} />}
                  {demande.statut}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Demandeur</p>
                <p className="font-semibold text-gray-800">{demande.utilisateur?.prenom} {demande.utilisateur?.nom}</p>
                <p className="text-sm text-gray-500">{demande.utilisateur?.email}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Soumise le</p>
                <p className="font-semibold text-gray-800">{new Date(demande.createdAt).toLocaleDateString('fr-FR')}</p>
                <p className="text-sm text-gray-500 mt-2">{demande.documents?.length || 0} document(s) joints</p>
              </div>
            </div>

            {demande.raisonRejet && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
                <p className="font-semibold">Motif de rejet</p>
                <p className="text-sm mt-1">{demande.raisonRejet}</p>
              </div>
            )}

            {(demande.dateRendezVous || demande.dateDisponibilite) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demande.dateRendezVous && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
                    <p className="text-xs text-purple-600 uppercase tracking-wide mb-2">Rendez-vous</p>
                    <p className="font-semibold text-gray-800">{new Date(demande.dateRendezVous).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                )}
                {demande.dateDisponibilite && (
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
                    <p className="text-xs text-teal-700 uppercase tracking-wide mb-2">Acte disponible</p>
                    <p className="font-semibold text-gray-800">{new Date(demande.dateDisponibilite).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Informations fournies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demande.donnees && Object.entries(demande.donnees).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-sm text-gray-700">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {demande.documents && demande.documents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h2 className="text-base font-semibold text-gray-800 mb-4">Documents téléchargés</h2>
                <div className="space-y-3">
                  {demande.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-800">{doc.nom}</p>
                        <p className="text-xs text-gray-500">Type : {doc.type}</p>
                      </div>
                      <a href={`${import.meta.env.VITE_API_URL || window.location.origin}${doc.url}`} target="_blank" rel="noreferrer"
                        className="text-sm text-green-700 font-semibold hover:text-green-900">
                        Voir
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
