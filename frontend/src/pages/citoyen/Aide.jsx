import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, HelpCircle, Search, ChevronDown, PlusCircle, Download } from 'lucide-react';

const faqs = {
  FAQ: [
    { q: 'Comment créer un compte sur la plateforme ?', r: 'Cliquez sur "S\'inscrire" en haut à droite, remplissez vos informations personnelles et validez votre email.' },
    { q: 'Puis-je faire plusieurs demandes en même temps ?', r: 'Oui, vous pouvez soumettre plusieurs demandes simultanément pour différents types d\'actes.' },
    { q: 'Comment puis-je suivre ma demande ?', r: 'Connectez-vous et allez dans "Mes Demandes" pour voir le statut en temps réel de toutes vos demandes.' },
  ],
  Documents: [
    { q: 'Quels formats de documents sont acceptés ?', r: 'Nous acceptons les formats PDF, JPG et PNG. Chaque fichier ne doit pas dépasser 5MB.' },
    { q: 'Mes documents sont-ils sécurisés ?', r: 'Oui, tous vos documents sont chiffrés et stockés de manière sécurisée conformément à la réglementation.' },
  ],
  'Tarifs & Délais': [
    { q: 'Les demandes en ligne sont-elles payantes ?', r: 'La plateforme est gratuite. Certains actes peuvent nécessiter le paiement de frais administratifs à la mairie.' },
    { q: 'Quel est le délai de traitement ?', r: 'Le délai varie selon le type d\'acte : de 3 à 15 jours ouvrables selon la complexité de la demande.' },
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
            <FileText size={18} color="white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">e-Mairie Douala</p>
            <p className="text-xs text-gray-500">Ville de Douala</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-green-700">Accueil</Link>
          <Link to="/demande" className="flex items-center gap-1 hover:text-green-700"><PlusCircle size={15}/> Nouvelle Demande</Link>
          <Link to="/dashboard" className="hover:text-green-700">Mes Demandes</Link>
          <Link to="/recuperer-acte" className="flex items-center gap-1 hover:text-green-700"><Download size={15}/> Récupérer Acte</Link>
          <Link to="/aide" className="flex items-center gap-1 text-green-700 font-semibold"><HelpCircle size={15}/> Aide</Link>
        </div>
        <Link to="/connexion" className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
          Se connecter
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={28} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Centre d'Aide</h1>
          <p className="text-gray-500">Trouvez des réponses à vos questions sur les services de la plateforme e-Mairie Douala</p>
        </div>

        {/* Onglets */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {Object.keys(faqs).map((tab) => (
            <button key={tab} onClick={() => setOnglet(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition
                ${onglet === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-2 mb-6 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input value={recherche} onChange={e => setRecherche(e.target.value)}
            placeholder="Rechercher dans les questions fréquentes..."
            className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400" />
        </div>

        {/* Questions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
            <FileText size={16} className="text-green-600" />
            <p className="font-semibold text-gray-800">{onglet}</p>
          </div>
          {questions.map((faq, i) => (
            <div key={i} className="border-b border-gray-50 last:border-0">
              <button onClick={() => setOuvert(ouvert === i ? null : i)}
                className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50 transition">
                <span className="text-sm font-medium text-gray-800">{faq.q}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${ouvert === i ? 'rotate-180' : ''}`} />
              </button>
              {ouvert === i && (
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.r}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
