import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = `${import.meta.env.VITE_API_URL || window.location.origin}/api`;

export default function ConfirmerDemande() {
  const { codeUnique } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [demande, setDemande] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [traitement, setTraitement] = useState(false);
  const [message, setMessage] = useState('');
  const [typeMessage, setTypeMessage] = useState('');
  
  const action = searchParams.get('action') || 'confirmer';

  useEffect(() => {
    chargerDemande();
  }, [codeUnique]);

  const chargerDemande = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/demandes/verifier/${codeUnique}`
      );
      setDemande(response.data.demande);
    } catch (error) {
      setMessage('Demande non trouvée. Vérifiez votre code.');
      setTypeMessage('erreur');
    } finally {
      setChargement(false);
    }
  };

  const handleConfirmer = async () => {
    setTraitement(true);
    try {
      const response = await axios.post(
        `${apiUrl}/demandes/confirmer/${codeUnique}`
      );
      setDemande(response.data.demande);
      setMessage(response.data.message);
      setTypeMessage('succès');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la confirmation');
      setTypeMessage('erreur');
    } finally {
      setTraitement(false);
    }
  };

  const handleModifier = async () => {
    setTraitement(true);
    try {
      const response = await axios.post(
        `${apiUrl}/demandes/modifier/${codeUnique}`
      );
      setDemande(response.data.demande);
      setMessage(response.data.message);
      setTypeMessage('info');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la demande de modification');
      setTypeMessage('erreur');
    } finally {
      setTraitement(false);
    }
  };

  if (chargement) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre demande...</p>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{message || 'Demande non trouvée'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const contenuMessage = {
    confirmer: {
      titre: '📋 Confirmation de vos informations',
      description: 'Veuillez vérifier que toutes les informations ci-dessous sont exactes avant de confirmer.'
    },
    modifier: {
      titre: '✏️ Modifier votre demande',
      description: 'Si vous souhaitez modifier les informations, cliquez sur "Demander une modification".'
    }
  };

  const contenu = contenuMessage[action] || contenuMessage.confirmer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {message && (
          <div className={`rounded-lg p-4 mb-6 ${
            typeMessage === 'succès' ? 'bg-green-50 text-green-700 border border-green-200' :
            typeMessage === 'erreur' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{contenu.titre}</h1>
            <p className="text-gray-600">{contenu.description}</p>
          </div>

          {/* Afficher les informations de la demande */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📄 Détails de votre demande</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Type d'acte</p>
                <p className="text-lg font-semibold text-gray-800">{demande.typeActe.replace(/_/g, ' ')}</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">Informations fournies :</p>
                <div className="bg-white rounded p-4 space-y-2">
                  {Object.entries(demande.donnees || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-700 font-medium">{key}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">Code de suivi</p>
                <p className="text-lg font-mono font-bold text-green-700">{demande.codeUnique}</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">Statut</p>
                <p className="text-lg font-semibold">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {demande.etapeConfirmation === 'EMAIL_ENVOYE' ? '📬 En attente de confirmation' : demande.etapeConfirmation}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {action === 'confirmer' && demande.etapeConfirmation === 'EMAIL_ENVOYE' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Attention :</strong> En confirmant, vous certifiez que toutes les informations sont exactes et authentiques.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmer}
                  disabled={traitement}
                  className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50"
                >
                  {traitement ? 'Traitement...' : '✅ Confirmer les informations'}
                </button>
                <button
                  onClick={() => navigate(`/confirmer-demande/${codeUnique}?action=modifier`)}
                  disabled={traitement}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  ✏️ Modifier
                </button>
              </div>
            </div>
          )}

          {action === 'modifier' && demande.etapeConfirmation === 'EMAIL_ENVOYE' && (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800 mb-3">
                  ⚠️ <strong>Veuillez contacter la mairie</strong> pour apporter les modifications nécessaires.
                </p>
                <p className="text-sm text-orange-700">
                  📞 Téléphone : +237 XXX XXX XXX<br/>
                  📧 Email : contact@mairie-douala.cm<br/>
                  🏛️ Adresse : Place de l'Indépendance, Douala
                </p>
              </div>

              <button
                onClick={handleModifier}
                disabled={traitement}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
              >
                {traitement ? 'Traitement...' : '📬 Demander une modification'}
              </button>

              <button
                onClick={() => navigate(`/confirmer-demande/${codeUnique}?action=confirmer`)}
                disabled={traitement}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
              >
                ← Retour à la confirmation
              </button>
            </div>
          )}

          {demande.etapeConfirmation !== 'EMAIL_ENVOYE' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800">
                ℹ️ Cette demande ne peut plus être modifiée. Statut actuel : <strong>{demande.etapeConfirmation}</strong>
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
              >
                Retour au tableau de bord
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
