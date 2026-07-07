import { useState } from 'react';
import { FileText, HelpCircle, Search, ChevronDown } from 'lucide-react';
import Navbar from '../../components/Navbar';

const faqs = {
  FAQ: [
    { q: 'Comment créer un compte sur la plateforme ?', r: 'Cliquez sur "S\'inscrire" en haut à droite, remplissez vos informations personnelles et validez votre email.' },
    { q: 'Puis-je faire plusieurs demandes en même temps ?', r: 'Oui, vous pouvez soumettre plusieurs demandes simultanément pour différents types d\'actes.' },
    { q: 'Comment puis-je suivre ma demande ?', r: 'Connectez-vous et allez dans "Mes Demandes" pour voir le statut en temps réel de toutes vos demandes.' },
  ],
  Documents: [
    { q: 'Quels formats de documents sont acceptés ?', r: 'Nous acceptons les formats PDF, JPG et PNG. Chaque fichier ne doit pas dépasser 5MB.' },
    { q: 'Mes documents sont-ils sécurisés ?', r: 'Oui, tous vos documents sont chiffrés et stockés de manière sécurisée.' },
  ],
  'Tarifs & Délais': [
    { q: 'Les demandes en ligne sont-elles payantes ?', r: 'La plateforme est gratuite. Certains actes peuvent nécessiter le paiement de frais administratifs à la mairie.' },
    { q: 'Quel est le délai de traitement ?', r: 'Le délai varie selon le type d\'acte : de 3 à 15 jours ouvrables.' },
  ],
  Contacts: [
    { q: 'Comment contacter la mairie ?', r: 'Par téléphone au +237 233 42 66 00, par email à contact@douala.cm, ou en personne à l\'Hôtel de Ville.' },
  ],
};

export default function Aide() {
  const [onglet, setOnglet] = useState('FAQ');
  const [recherche, setRecherche] = useState('');
  const [ouvert, setOuvert] = useState(null);

  const questions = faqs[onglet].filter(f =>
    f.q.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HelpCircle size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Centre d'Aide</h1>
          <p className="text-gray-600">
            Trouvez des réponses à vos questions sur les services de la plateforme e-Mairie Douala
          </p>
        </div>

        {/* Onglets */}
        <div className="flex bg-white rounded-xl p-1.5 mb-6 shadow-md border border-gray-100">
          {Object.keys(faqs).map((tab) => (
            <button key={tab} onClick={() => setOnglet(tab)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300
                ${onglet === tab 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-green-600'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-2 mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <Search size={18} className="text-green-500" />
          <input value={recherche} onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher dans les questions fréquentes..."
            className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400" />
        </div>

        {/* Questions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-4">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-transparent">
            <FileText size={18} className="text-green-600" />
            <p className="font-bold text-gray-800 text-lg">{onglet}</p>
          </div>
          <div className="divide-y divide-gray-100">
            {questions.map((faq, i) => (
              <div key={i} className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-colors duration-200">
                <button onClick={() => setOuvert(ouvert === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{faq.q}</span>
                  <ChevronDown size={18} className={`text-green-600 transition-transform duration-300 ${ouvert === i ? 'rotate-180' : ''}`} />
                </button>
                {ouvert === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 animate-fade-in">
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
