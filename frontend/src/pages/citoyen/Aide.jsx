import { useState } from 'react';
import { FileText, HelpCircle, Search, ChevronDown } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useLangue } from '../../context/LangueContext';

export default function Aide() {
  const { t, langue } = useLangue();
  const [recherche, setRecherche] = useState('');
  const [ouvert, setOuvert] = useState(null);

  const faqs = langue === 'en' ? {
    FAQ: [
      { q: 'How do I create an account on the platform?', r: 'Click on "Register" in the top right corner, fill in your personal information and validate your email.' },
      { q: 'Can I make multiple requests at the same time?', r: 'Yes, you can submit multiple requests simultaneously for different types of documents.' },
      { q: 'How can I track my request?', r: 'Log in and go to "My Requests" to see the real-time status of all your requests.' },
    ],
    Documents: [
      { q: 'What file formats are accepted?', r: 'We accept PDF, JPG and PNG formats. Each file must not exceed 5MB.' },
      { q: 'Are my documents secure?', r: 'Yes, all your documents are encrypted and stored securely in compliance with regulations.' },
    ],
    'Fees & Delays': [
      { q: 'Are online requests free?', r: 'The platform is free. Some documents may require payment of administrative fees at the town hall.' },
      { q: 'What is the processing time?', r: 'The delay varies depending on the type of document: from 3 to 15 working days.' },
    ],
    Contacts: [
      { q: 'How do I contact the town hall?', r: 'By phone at +237 233 42 66 00, by email at contact@douala.cm, or in person at the Town Hall.' },
    ],
  } : {
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

  const onglets = Object.keys(faqs);
  const [onglet, setOnglet] = useState(onglets[0]);

  const questions = faqs[onglet]?.filter(f =>
    f.q.toLowerCase().includes(recherche.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={28} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.centreAide}</h1>
          <p className="text-gray-500">{t.descAide}</p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {onglets.map((tab) => (
            <button key={tab} onClick={() => { setOnglet(tab); setOuvert(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition
                ${onglet === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-2 mb-6 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input value={recherche} onChange={e => setRecherche(e.target.value)}
            placeholder={t.rechercherQuestions}
            className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400" />
        </div>

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
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.r}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
