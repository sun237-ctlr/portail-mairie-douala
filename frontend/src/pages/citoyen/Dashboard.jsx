import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMesDemandes } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AssistantIA from '../../components/AssistantIA';
import Navbar from '../../components/Navbar';
import { FileText, PlusCircle, Clock, CheckCircle, XCircle, Search, SlidersHorizontal, Download, Calendar } from 'lucide-react';

const statutConfig = {
  EN_ATTENTE: { label: 'En attente', couleur: 'bg-yellow-100 text-yellow-700', Icon: Clock },
  VERIFICATION_EN_COURS: { label: 'En traitement', couleur: 'bg-blue-100 text-blue-700', Icon: Clock },
  ACCEPTE: { label: 'Terminée', couleur: 'bg-green-100 text-green-700', Icon: CheckCircle },
  REJETE: { label: 'Rejetée', couleur: 'bg-red-100 text-red-700', Icon: XCircle },
  RENDEZ_VOUS_PROGRAMME: { label: 'RDV programmé', couleur: 'bg-purple-100 text-purple-700', Icon: Calendar },
  ACTE_DISPONIBLE: { label: 'Disponible', couleur: 'bg-teal-100 text-teal-700', Icon: CheckCircle },
};

export default function Dashboard() {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    if (!utilisateur) { navigate('/connexion'); return; }
    getMesDemandes()
      .then(res => setDemandes(res.data.demandes))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, [utilisateur, navigate]);

  const demandesFiltrees = demandes.filter(d =>
    d.typeActe.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: demandes.length, Icon: FileText, iconColor: 'text-gray-400' },
            { label: 'En Attente', count: demandes.filter(d => d.statut === 'EN_ATTENTE').length, Icon: Clock, iconColor: 'text-yellow-500' },
            { label: 'En Traitement', count: demandes.filter(d => d.statut === 'VERIFICATION_EN_COURS').length, Icon: Clock, iconColor: 'text-blue-500' },
            { label: 'Terminées', count: demandes.filter(d => ['ACCEPTE', 'ACTE_DISPONIBLE'].includes(d.statut)).length, Icon: CheckCircle, iconColor: 'text-green-500' },
          ].map(({ label, count, Icon, iconColor }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-800">{count}</p>
              </div>
              <Icon size={32} className={iconColor} strokeWidth={1.5} />
            </div>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 mb-4 shadow-sm">
          <div className="flex-1 flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              placeholder="Rechercher par type ou référence..."
              className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal size={14} /> Filtres avancés
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
            <Download size={14} /> Exporter
          </button>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {chargement ? (
            <div className="text-center py-16 text-gray-400">Chargement...</div>
          ) : demandesFiltrees.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" strokeWidth={1} />
              <p className="font-semibold text-gray-600 mb-1">Aucune demande trouvée</p>
              <p className="text-sm text-gray-400 mb-6">
                {recherche ? 'Essayez de modifier vos critères de recherche' : 'Commencez par faire votre première demande'}
              </p>
              <Link to="/demande"
                className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                Nouvelle demande
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {demandesFiltrees.map((demande) => {
                const config = statutConfig[demande.statut] || {};
                const Icon = config.Icon || FileText;
                return (
                  <div key={demande.id} className="p-5 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                          <FileText size={18} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {demande.typeActe.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Soumise le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                            {demande.documents?.length > 0 && ` • ${demande.documents.length} doc(s)`}
                          </p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${config.couleur}`}>
                        <Icon size={13} /> {config.label}
                      </span>
                    </div>

                    {demande.raisonRejet && (
                      <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-700">
                        <strong>Motif de rejet :</strong> {demande.raisonRejet}
                      </div>
                    )}
                 
                    {demande.dateRendezVous && (
                      <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-sm text-purple-700 flex items-center gap-2">
                        <Calendar size={14} /> Rendez-vous le : <strong>{new Date(demande.dateRendezVous).toLocaleDateString('fr-FR')}</strong>
                      </div>
                    )}
                    {demande.dateDisponibilite && (
                      <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle size={14} /> Acte disponible le : <strong>{new Date(demande.dateDisponibilite).toLocaleDateString('fr-FR')}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bouton flottant mobile */}
        <Link to="/demande"
          className="fixed bottom-24 right-6 md:hidden bg-green-600 text-white p-4 rounded-full shadow-lg">
          <PlusCircle size={24} />
        </Link>
      </div>

      <AssistantIA />
    </div>
  );
}
