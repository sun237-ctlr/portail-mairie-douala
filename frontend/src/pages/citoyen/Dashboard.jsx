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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes demandes</h1>
            <p className="text-sm text-gray-500">Consultez vos demandes en cours et soumettez-en une nouvelle.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/demande')}
            className="inline-flex items-center justify-center bg-green-600 text-white px-5 py-3 rounded-2xl font-semibold hover:bg-green-700 transition btn-smooth"
          >
            Nouvelle demande
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: demandes.length, Icon: FileText, gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' },
            { label: 'En Attente', count: demandes.filter(d => d.statut === 'EN_ATTENTE').length, Icon: Clock, gradient: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50' },
            { label: 'En Traitement', count: demandes.filter(d => d.statut === 'VERIFICATION_EN_COURS').length, Icon: Clock, gradient: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
            { label: 'Terminées', count: demandes.filter(d => ['ACCEPTE', 'ACTE_DISPONIBLE'].includes(d.statut)).length, Icon: CheckCircle, gradient: 'from-green-400 to-green-600', bg: 'bg-green-50' },
          ].map(({ label, count, Icon, gradient, bg }, idx) => (
            <div key={label} className={`${bg} rounded-xl border border-gray-200 p-5 flex justify-between items-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 transform`}
              style={{animationDelay: `${idx * 50}ms`}}>
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent">{count}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex-1 flex items-center gap-2">
            <Search size={18} className="text-green-500" />
            <input
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              placeholder="Rechercher par type ou référence..."
              className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all">
            <SlidersHorizontal size={14} /> Filtres
          </button>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden card">
          {chargement ? (
            <div className="text-center py-16 text-gray-400">
              <div className="animate-spin inline-block">
                <Clock size={32} className="opacity-50" />
              </div>
              <p className="mt-2">Chargement de vos demandes...</p>
            </div>
          ) : demandesFiltrees.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" strokeWidth={1} />
              <p className="font-semibold text-gray-600 mb-1">Aucune demande trouvée</p>
              <p className="text-sm text-gray-400 mb-6">
                {recherche ? 'Essayez de modifier vos critères de recherche' : 'Commencez par faire votre première demande'}
              </p>
              <Link to="/demande"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-block">
                Nouvelle demande
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {demandesFiltrees.map((demande, idx) => {
                const config = statutConfig[demande.statut] || {};
                const Icon = config.Icon || FileText;
                return (
                  <div key={demande.id} className="p-5 hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-colors duration-200 group card card-inner"
                    style={{animationDelay: `${idx * 30}ms`}}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <FileText size={20} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-base group-hover:text-green-700 transition-colors">
                            {demande.typeActe.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Soumise le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                            {demande.documents?.length > 0 && ` • ${demande.documents.length} doc(s)`}
                          </p>
                          <button type="button" onClick={() => navigate(`/dashboard/demande/${demande.id}`)}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-900 transition btn-smooth">
                            Voir le détail
                          </button>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${config.couleur}`}>
                        <Icon size={13} /> {config.label}
                      </span>
                    </div>

                    {demande.raisonRejet && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700 flex items-center gap-2">
                        <span className="font-semibold">Motif de rejet :</span> {demande.raisonRejet}
                      </div>
                    )}
                 
                    {demande.dateRendezVous && (
                      <div className="mt-3 bg-gradient-to-r from-purple-50 to-transparent border border-purple-200 rounded-xl px-4 py-2.5 text-sm text-purple-700 flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500" /> 
                        <span>Rendez-vous le <strong>{new Date(demande.dateRendezVous).toLocaleDateString('fr-FR')}</strong></span>
                      </div>
                    )}
                    {demande.dateDisponibilite && (
                      <div className="mt-3 bg-gradient-to-r from-teal-50 to-transparent border border-teal-200 rounded-xl px-4 py-2.5 text-sm text-teal-700 flex items-center gap-2">
                        <CheckCircle size={16} className="text-teal-500" /> 
                        <span>Acte disponible le <strong>{new Date(demande.dateDisponibilite).toLocaleDateString('fr-FR')}</strong></span>
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
          className="fixed bottom-24 right-6 md:hidden bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
          <PlusCircle size={24} />
        </Link>
      </div>

      <AssistantIA />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        div[style*="animationDelay"] {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
