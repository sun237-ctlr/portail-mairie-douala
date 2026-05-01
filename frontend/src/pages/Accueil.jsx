import { Link } from 'react-router-dom';

const actes = [
  { icon: '👶', label: 'Acte de naissance' },
  { icon: '💍', label: 'Acte de mariage' },
  { icon: '🕊️', label: 'Acte de décès' },
  { icon: '🏠', label: 'Certificat de résidence' },
  { icon: '✅', label: 'Certificat de vie' },
  { icon: '💼', label: 'Certificat de célibat' },
  { icon: '📄', label: 'Légalisation de documents' },
  { icon: '📍', label: 'Attestation de domicile' },
  { icon: '🇨🇲', label: 'Certificat de nationalité' },
  { icon: '👨‍👩‍👧', label: 'Autorisation parentale' },
];

export default function Accueil() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <div>
            <p className="font-bold text-lg leading-tight">Mairie de Douala</p>
            <p className="text-green-200 text-xs">Portail des actes administratifs</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/connexion" className="px-4 py-2 border border-white rounded-lg text-sm hover:bg-green-600 transition">
            Connexion
          </Link>
          <Link to="/inscription" className="px-4 py-2 bg-white text-green-700 rounded-lg text-sm font-semibold hover:bg-green-50 transition">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-green-700 text-white text-center py-16 px-4">
        <h1 className="text-3xl font-bold mb-3">Vos démarches administratives en ligne</h1>
        <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto">
          Demandez et suivez vos actes administratifs depuis chez vous, sans faire la queue.
        </p>
        <Link to="/inscription" className="bg-white text-green-700 font-bold px-8 py-3 rounded-full text-lg hover:bg-green-50 transition shadow-lg">
          Commencer ma demande →
        </Link>
      </div>

      {/* Actes disponibles */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">10 actes disponibles en ligne</h2>
        <p className="text-center text-gray-500 mb-8">Sélectionnez l'acte dont vous avez besoin</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {actes.map((acte, i) => (
            <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-green-300 transition cursor-pointer">
              <div className="text-3xl mb-2">{acte.icon}</div>
              <p className="text-xs font-medium text-gray-700 leading-tight">{acte.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="bg-white py-12 px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Comment ça marche ?</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { step: '1', icon: '📝', title: 'Créez un compte', desc: 'Inscrivez-vous gratuitement' },
            { step: '2', icon: '📋', title: 'Remplissez le formulaire', desc: 'Choisissez votre acte et remplissez les infos' },
            { step: '3', icon: '📎', title: 'Joignez vos documents', desc: 'Scannez ou photographiez vos pièces' },
            { step: '4', icon: '🏛️', title: 'Récupérez votre acte', desc: 'Venez chercher votre acte à la mairie' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-bold mb-3">
                {item.step}
              </div>
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-800 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-green-200 text-center py-6 text-sm">
        <p>🏛️ Mairie de Douala — Portail des actes administratifs</p>
        <p className="mt-1 text-xs">Projet DUT IUT de Douala 2025-2026</p>
      </footer>
    </div>
  );
}
