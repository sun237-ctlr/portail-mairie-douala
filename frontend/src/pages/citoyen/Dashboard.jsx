import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMesDemandes } from '../../services/api';
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
  ACTE_DISPONIBLE: '🎉 Acte disponible',
};

export default function Dashboard() {
  const { utilisateur, logout } = useAuth();
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!utilisateur) { navigate('/connexion'); return; }
    getMesDemandes()
      .then(res => setDemandes(res.data.demandes))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, [utilisateur, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏛️</span>
          <span className="font-bold">Mairie de Douala</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-200">Bonjour, {utilisateur?.prenom} 👋</span>
          <button onClick={handleLogout} className="text-sm border border-white px-3 py-1 rounded-lg hover:bg-green-600 transition">
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Actions rapides */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mes demandes</h1>
          <Link to="/demande" className="bg-green-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-800 transition flex items-center gap-2">
            <span>+</span> Nouvelle demande
          </Link>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', count: demandes.length, color: 'bg-gray-100' },
            { label: 'En attente', count: demandes.filter(d => d.statut === 'EN_ATTENTE').length, color: 'bg-yellow-50' },
            { label: 'Acceptées', count: demandes.filter(d => d.statut === 'ACCEPTE').length, color: 'bg-green-50' },
            { label: 'Disponibles', count: demandes.filter(d => d.statut === 'ACTE_DISPONIBLE').length, color: 'bg-teal-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Liste des demandes */}
        {chargement ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : demandes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-4xl mb-3">📄</p>
            <p className="text-gray-600 font-medium">Aucune demande pour l'instant</p>
            <p className="text-gray-400 text-sm mb-6">Commencez par faire votre première demande</p>
            <Link to="/demande" className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition">
              Faire une demande
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {demandes.map((demande) => (
              <div key={demande.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{demande.typeActe.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Soumise le {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                    {demande.raisonRejet && (
                      <p className="text-sm text-red-600 mt-2 bg-red-50 px-3 py-2 rounded-lg">
                        Motif de rejet : {demande.raisonRejet}
                      </p>
                    )}
                    {demande.dateDisponibilite && (
                      <p className="text-sm text-green-600 mt-2">
                        📅 Disponible le : {new Date(demande.dateDisponibilite).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statutColors[demande.statut]}`}>
                    {statutLabels[demande.statut]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
