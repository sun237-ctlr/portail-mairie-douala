import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Download, HelpCircle, PlusCircle } from 'lucide-react';

export default function RecupererActe() {
  const [code, setCode] = useState('');

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
          <Link to="/recuperer-acte" className="flex items-center gap-1 text-green-700 font-semibold"><Download size={15}/> Récupérer Acte</Link>
          <Link to="/aide" className="flex items-center gap-1 hover:text-green-700"><HelpCircle size={15}/> Aide</Link>
        </div>
        <Link to="/connexion" className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
          Se connecter
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download size={28} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Récupérer Mon Acte</h1>
          <p className="text-gray-500">Entrez le code secret fourni par l'administration pour télécharger votre acte</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Search size={18} className="text-gray-500" />
            <p className="font-semibold text-gray-800">Rechercher avec le code secret</p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code Secret</label>
          <div className="flex gap-3">
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Ex : ABC12345"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-2 text-sm">
              <Search size={15} /> Rechercher
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Le code secret est composé de 8 caractères (lettres et chiffres)</p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-blue-600" />
            <p className="font-semibold text-blue-800">Comment obtenir mon code secret ?</p>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            {[
              'Le code secret vous est communiqué par votre mairie d\'arrondissement',
              'Il est généré lorsque votre acte est finalisé et prêt au téléchargement',
              'Conservez précieusement ce code pour accéder à votre document',
              'En cas de perte, contactez votre mairie avec votre numéro de référence',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-sm text-gray-500 mb-3">Besoin d'aide ?</p>
        <div className="flex justify-center gap-3">
          <button className="border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm hover:bg-gray-50">
            Contacter l'administration
          </button>
          <Link to="/aide" className="border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm hover:bg-gray-50">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
