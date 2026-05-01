import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDemandesAdmin, accepterDemande, rejeterDemande } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const statutColors = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
  VERIFICATION_EN_COURS: 'bg-blue-100 text-blue-800',
  ACCEPTE: 'bg-green-100 text-green-800',
  REJETE: 'bg-red-100 text-red-800',
  RENDEZ_VOUS_PROGRAMME: 'bg-purple-100 text-purple-800',
  ACTE_DISPONIBLE: 'bg-teal-100 text-teal-800',
};

const statutLabels = {
  EN_ATTENTE: '⏳ En attente',
  VERIFICATION_EN_COURS: '🔍 En vérification',
  ACCEPTE: '✅ Accepté',
  REJETE: '❌ Rejeté',
  RENDEZ_VOUS_PROGRAMME: '📅 RDV programmé',
  ACTE_DISPONIBLE: '🎉 Disponible',
};

export default function DashboardAdmin() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('');
  const [chargement, setChargement] = useState(true);
  const [demandeSelectionnee, setDemandeSelectionnee] = useState(null);
  const [modal, setModal] = useState(null);
  const [raisonRejet, setRaisonRejet] = useState('');
  const [dateRdv, setDateRdv] = useState('');
  const [dateDispo, setDateDispo] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!admin) { navigate('/admin/connexion'); return; }
    chargerDemandes();
  }, [admin, filtreStatut]);

  const chargerDemandes = async () => {
    setChargement(true);
    try {
      const params = filtreStatut ? { statut: filtreStatut } : {};
      const res = await getDemandesAdmin(params);
      setDemandes(res.data.demandes);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };

  const handleAccepter = async () => {
    try {
      await accepterDemande(demandeSelectionnee.id, {
        dateRendezVous: dateRdv,
        dateDisponibilite: dateDispo
      });
      setMessage('✅ Demande acceptée avec succès');
      setModal(null);
      setDemandeSelectionnee(null);
      chargerDemandes();
    } catch (err) {
      setMessage('❌ Erreur lors de l\'acceptation');
    }
  };

  const handleRejeter = async () => {
    if (!raisonRejet) { setMessage('Veuillez indiquer la raison du rejet'); return; }
    try {
      await rejeterDemande(demandeSelectionnee.id, { raisonRejet });
      setMessage('Demande rejetée');
      setModal(null);
      setDemandeSelectionnee(null);
      setRaisonRejet('');
      chargerDemandes();
    } catch (err) {
      setMessage('❌ Erreur lors du rejet');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏛️</span>
          <div>
            <p className="font-bold">Mairie de Douala — Admin</p>
            <p className="text-gray-400 text-xs">Agent : {admin?.nom} {admin?.prenom}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="text-sm border border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-800">
          Déconnexion
        </button>
      </nav>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {message}
            <button onClick={() => setMessage('')} className="ml-4 text-green-500">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: demandes.length, color: 'bg-white' },
            { label: 'En attente', count: demandes.filter(d => d.statut === 'EN_ATTENTE').length, color: 'bg-yellow-50' },
            { label: 'Acceptées', count: demandes.filter(d => d.statut === 'ACCEPTE').length, color: 'bg-green-50' },
            { label: 'Rejetées', count: demandes.filter(d => d.statut === 'REJETE').length, color: 'bg-red-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center shadow-sm`}>
              <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-3 flex-wrap">
          {['', 'EN_ATTENTE', 'ACCEPTE', 'REJETE', 'ACTE_DISPONIBLE'].map((statut) => (
            <button key={statut} onClick={() => setFiltreStatut(statut)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${filtreStatut === statut ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {statut === '' ? 'Toutes' : statutLabels[statut]}
            </button>
          ))}
        </div>

        {/* Liste des demandes */}
        {chargement ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : demandes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">
            Aucune demande trouvée
          </div>
        ) : (
          <div className="space-y-4">
            {demandes.map((demande) => (
              <div key={demande.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-800">
                        {demande.typeActe.replace(/_/g, ' ')}
                      </p>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statutColors[demande.statut]}`}>
                        {statutLabels[demande.statut]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      👤 {demande.utilisateur?.prenom} {demande.utilisateur?.nom}
                      <span className="ml-2 text-gray-400">— {demande.utilisateur?.email}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Soumise le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                      {demande.documents?.length > 0 && (
                        <span className="ml-2">📎 {demande.documents.length} document(s)</span>
                      )}
                    </p>
                    {demande.raisonRejet && (
                      <p className="text-sm text-red-600 mt-2 bg-red-50 px-3 py-1 rounded">
                        Motif : {demande.raisonRejet}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {demande.statut === 'EN_ATTENTE' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => { setDemandeSelectionnee(demande); setModal('accepter'); }}
                        className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition">
                        ✅ Accepter
                      </button>
                      <button
                        onClick={() => { setDemandeSelectionnee(demande); setModal('rejeter'); }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                        ❌ Rejeter
                      </button>
                    </div>
                  )}
                </div>

                {/* Données du formulaire */}
                {demande.donnees && (
                  <details className="mt-3">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                      Voir les informations soumises
                    </summary>
                    <div className="mt-2 bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2">
                      {Object.entries(demande.donnees).map(([k, v]) => (
                        <div key={k}>
                          <p className="text-xs text-gray-500">{k}</p>
                          <p className="text-sm font-medium text-gray-800">{v}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Accepter */}
      {modal === 'accepter' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✅ Accepter la demande</h3>
            <p className="text-sm text-gray-600 mb-4">
              Demande : <strong>{demandeSelectionnee?.typeActe.replace(/_/g, ' ')}</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de rendez-vous</label>
                <input type="datetime-local" value={dateRdv} onChange={e => setDateRdv(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de disponibilité de l'acte</label>
                <input type="datetime-local" value={dateDispo} onChange={e => setDateDispo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleAccepter}
                className="flex-1 bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejeter */}
      {modal === 'rejeter' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">❌ Rejeter la demande</h3>
            <p className="text-sm text-gray-600 mb-4">
              Demande : <strong>{demandeSelectionnee?.typeActe.replace(/_/g, ' ')}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raison du rejet *
              </label>
              <textarea value={raisonRejet} onChange={e => setRaisonRejet(e.target.value)}
                rows={4} placeholder="Expliquez clairement pourquoi la demande est rejetée..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setModal(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleRejeter}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
