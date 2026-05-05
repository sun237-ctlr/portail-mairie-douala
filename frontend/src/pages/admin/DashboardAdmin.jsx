import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDemandesAdmin, accepterDemande, rejeterDemande } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FileText, LogOut, CheckCircle, XCircle, Clock,
  User, ChevronDown, Building2, Check, X, Calendar
} from 'lucide-react';

const statutConfig = {
  EN_ATTENTE: { label: 'En attente', couleur: 'bg-yellow-100 text-yellow-800', Icon: Clock },
  VERIFICATION_EN_COURS: { label: 'En vérification', couleur: 'bg-blue-100 text-blue-800', Icon: Clock },
  ACCEPTE: { label: 'Accepté', couleur: 'bg-green-100 text-green-800', Icon: CheckCircle },
  REJETE: { label: 'Rejeté', couleur: 'bg-red-100 text-red-800', Icon: XCircle },
  RENDEZ_VOUS_PROGRAMME: { label: 'RDV programmé', couleur: 'bg-purple-100 text-purple-800', Icon: Calendar },
  ACTE_DISPONIBLE: { label: 'Disponible', couleur: 'bg-teal-100 text-teal-800', Icon: CheckCircle },
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
  const [demandesOuvertes, setDemandesOuvertes] = useState({});

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
      await accepterDemande(demandeSelectionnee.id, { dateRendezVous: dateRdv, dateDisponibilite: dateDispo });
      setMessage('Demande acceptée avec succès');
      setModal(null);
      setDemandeSelectionnee(null);
      chargerDemandes();
    } catch {
      setMessage('Erreur lors de l\'acceptation');
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
    } catch {
      setMessage('Erreur lors du rejet');
    }
  };

  const toggleDemande = (id) => setDemandesOuvertes(prev => ({ ...prev, [id]: !prev[id] }));

  const filtres = [
    { value: '', label: 'Toutes' },
    { value: 'EN_ATTENTE', label: 'En attente', Icon: Clock },
    { value: 'ACCEPTE', label: 'Accepté', Icon: CheckCircle },
    { value: 'REJETE', label: 'Rejeté', Icon: XCircle },
    { value: 'ACTE_DISPONIBLE', label: 'Disponible', Icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Building2 size={22} className="text-green-400" />
          <div>
            <p className="font-bold">Mairie de Douala — Admin</p>
            <p className="text-gray-400 text-xs">Agent : {admin?.nom} {admin?.prenom}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-2 text-sm border border-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">
          <LogOut size={14} /> Déconnexion
        </button>
      </nav>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm flex justify-between items-center">
            <div className="flex items-center gap-2"><CheckCircle size={16} /> {message}</div>
            <button onClick={() => setMessage('')}><X size={14} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: demandes.length, Icon: FileText, couleur: 'bg-white text-gray-700' },
            { label: 'En attente', count: demandes.filter(d => d.statut === 'EN_ATTENTE').length, Icon: Clock, couleur: 'bg-yellow-50 text-yellow-700' },
            { label: 'Acceptées', count: demandes.filter(d => d.statut === 'ACCEPTE').length, Icon: CheckCircle, couleur: 'bg-green-50 text-green-700' },
            { label: 'Rejetées', count: demandes.filter(d => d.statut === 'REJETE').length, Icon: XCircle, couleur: 'bg-red-50 text-red-700' },
          ].map(({ label, count, Icon, couleur }) => (
            <div key={label} className={`${couleur} rounded-xl p-5 flex justify-between items-center shadow-sm border border-gray-100`}>
              <div>
                <p className="text-xs opacity-70 mb-1">{label}</p>
                <p className="text-3xl font-bold">{count}</p>
              </div>
              <Icon size={28} strokeWidth={1.5} className="opacity-40" />
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2 flex-wrap border border-gray-100">
          {filtres.map(({ value, label, Icon }) => (
            <button key={value} onClick={() => setFiltreStatut(value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition
                ${filtreStatut === value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {Icon && <Icon size={14} />} {label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {chargement ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : demandes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">
            <FileText size={40} className="mx-auto mb-3 opacity-30" strokeWidth={1} />
            <p>Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {demandes.map((demande) => {
              const config = statutConfig[demande.statut] || {};
              const Icon = config.Icon || FileText;
              return (
                <div key={demande.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-gray-800 tracking-wide">
                          {demande.typeActe.replace(/_/g, ' ')}
                        </p>
                        <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${config.couleur}`}>
                          <Icon size={12} /> {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={13} className="text-gray-400" />
                        <span className="font-medium text-green-700">
                          {demande.utilisateur?.prenom} {demande.utilisateur?.nom}
                        </span>
                        <span className="text-gray-400">—</span>
                        <span className="text-gray-500">{demande.utilisateur?.email}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Soumise le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                        {demande.documents?.length > 0 && (
                          <span className="ml-2 flex items-center gap-1 inline-flex">
                            <FileText size={11} /> {demande.documents.length} document(s)
                          </span>
                        )}
                      </p>
                      {demande.raisonRejet && (
                        <div className="mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-700 flex items-center gap-2">
                          <XCircle size={14} /> Motif : {demande.raisonRejet}
                        </div>
                      )}
                    </div>

                    {demande.statut === 'EN_ATTENTE' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => { setDemandeSelectionnee(demande); setModal('accepter'); }}
                          className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                          <Check size={15} /> Accepter
                        </button>
                        <button
                          onClick={() => { setDemandeSelectionnee(demande); setModal('rejeter'); }}
                          className="flex items-center gap-1.5 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                          <X size={15} /> Rejeter
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Données formulaire */}
                  {demande.donnees && (
                    <div className="mt-3">
                      <button onClick={() => toggleDemande(demande.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                        <ChevronDown size={14} className={`transition-transform ${demandesOuvertes[demande.id] ? 'rotate-180' : ''}`} />
                        Voir les informations soumises
                      </button>
                      {demandesOuvertes[demande.id] && (
                        <div className="mt-2 bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3">
                          {Object.entries(demande.donnees).map(([k, v]) => (
                            <div key={k}>
                              <p className="text-xs text-gray-400">{k}</p>
                              <p className="text-sm font-medium text-gray-800">{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Accepter */}
      {modal === 'accepter' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Accepter la demande</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Demande : <strong>{demandeSelectionnee?.typeActe.replace(/_/g, ' ')}</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={14} className="inline mr-1" /> Date de rendez-vous
                </label>
                <input type="datetime-local" value={dateRdv} onChange={e => setDateRdv(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CheckCircle size={14} className="inline mr-1" /> Date de disponibilité de l'acte
                </label>
                <input type="datetime-local" value={dateDispo} onChange={e => setDateDispo(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium">
                Annuler
              </button>
              <button onClick={handleAccepter}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 text-sm flex items-center justify-center gap-2">
                <Check size={16} /> Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejeter */}
      {modal === 'rejeter' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={20} className="text-red-600" />
              <h3 className="text-lg font-bold text-gray-800">Rejeter la demande</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Demande : <strong>{demandeSelectionnee?.typeActe.replace(/_/g, ' ')}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raison du rejet *</label>
              <textarea value={raisonRejet} onChange={e => setRaisonRejet(e.target.value)}
                rows={4} placeholder="Expliquez clairement pourquoi la demande est rejetée..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setModal(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium">
                Annuler
              </button>
              <button onClick={handleRejeter}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold hover:bg-red-700 text-sm flex items-center justify-center gap-2">
                <X size={16} /> Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
