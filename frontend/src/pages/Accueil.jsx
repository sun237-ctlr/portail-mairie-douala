import { Link } from 'react-router-dom';
import AssistantIA from '../components/AssistantIA';
import {
  FileText, Baby, Heart, Cross, Home, Flag,
  CheckSquare, Scale, MapPin, Users, Clock,
  Shield, Smartphone, LayoutDashboard, PlusCircle,
  FolderOpen, Download, HelpCircle, Facebook,
  Twitter, Instagram, FileCheck, Activity
} from 'lucide-react';

const services = [
  { Icon: Baby, couleur: 'bg-blue-500', label: 'Acte de naissance', desc: "Demandez une copie ou un extrait d'acte de naissance", key: 'ACTE_NAISSANCE' },
  { Icon: Heart, couleur: 'bg-pink-500', label: 'Acte de mariage', desc: 'Obtenez votre acte de mariage certifié', key: 'ACTE_MARIAGE' },
  { Icon: Cross, couleur: 'bg-gray-500', label: 'Acte de décès', desc: "Demandez un acte de décès officiel", key: 'ACTE_DECES' },
  { Icon: Home, couleur: 'bg-green-500', label: 'Certificat de résidence', desc: 'Attestation de domicile dans votre arrondissement', key: 'CERTIFICAT_RESIDENCE' },
  { Icon: Flag, couleur: 'bg-yellow-500', label: 'Certificat de nationalité', desc: 'Document certifiant votre nationalité camerounaise', key: 'CERTIFICAT_NATIONALITE' },
  { Icon: FileCheck, couleur: 'bg-purple-500', label: 'Légalisation', desc: 'Légalisation de documents administratifs', key: 'LEGALISATION_DOCUMENTS' },
  { Icon: Activity, couleur: 'bg-teal-500', label: 'Certificat de vie', desc: 'Attestation prouvant que vous êtes en vie', key: 'CERTIFICAT_VIE' },
  { Icon: MapPin, couleur: 'bg-orange-500', label: 'Attestation de domicile', desc: 'Document attestant votre adresse', key: 'ATTESTATION_DOMICILE' },
  { Icon: Scale, couleur: 'bg-red-500', label: 'Attestation de célibat', desc: 'Document certifiant votre statut de célibataire', key: 'CERTIFICAT_CELIBAT' },
  { Icon: Users, couleur: 'bg-indigo-500', label: 'Autorisation parentale', desc: 'Autorisation pour mineur', key: 'AUTORISATION_PARENTALE' },
];

const arrondissements = [
  'Douala 1er', 'Douala 2e (Nouvelle-Deïdo)',
  'Douala 3e (Nylon)', 'Douala 4e (Bonabéri)',
  'Douala 5e (Kotto)', 'Douala 6e (Bassa)',
];

const etapes = [
  { step: '1', Icon: PlusCircle, title: 'Créez un compte', desc: 'Inscrivez-vous gratuitement en quelques minutes' },
  { step: '2', Icon: FileText, title: 'Choisissez votre acte', desc: 'Sélectionnez parmi nos 10 actes disponibles' },
  { step: '3', Icon: Download, title: 'Joignez vos documents', desc: 'Scannez ou photographiez vos pièces justificatives' },
  { step: '4', Icon: CheckSquare, title: 'Récupérez votre acte', desc: 'Venez chercher votre acte à la mairie au rendez-vous' },
];

export default function Accueil() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
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
        <div className="hidden md:flex items-center gap-5 text-sm text-gray-600">
          <Link to="/" className="flex items-center gap-1.5 text-green-700 font-medium">
            <LayoutDashboard size={15} /> Accueil
          </Link>
          <Link to="/inscription" className="flex items-center gap-1.5 hover:text-green-700">
            <PlusCircle size={15} /> Nouvelle Demande
          </Link>
          <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-green-700">
            <FolderOpen size={15} /> Mes Demandes
          </Link>
          <Link to="/recuperer-acte" className="flex items-center gap-1.5 hover:text-green-700">
            <Download size={15} /> Récupérer Acte
          </Link>
          <Link to="/aide" className="flex items-center gap-1.5 hover:text-green-700">
            <HelpCircle size={15} /> Aide
          </Link>
        </div>
        <Link to="/connexion"
          className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
          Se connecter
        </Link>
      </nav>

      {/* HERO */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 40%, #a3e635 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-white">
            <span className="inline-block bg-white bg-opacity-20 text-white text-xs px-4 py-1 rounded-full mb-6">
              Service de la Ville de Douala
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Demandez vos actes<br />administratifs<br />en ligne
            </h1>
            <p className="text-green-100 text-lg mb-8 max-w-lg">
              Un portail moderne et sécurisé pour faciliter vos démarches administratives. Simple, rapide et accessible 24h/24.
            </p>
            <div className="flex gap-4">
              <Link to="/inscription"
                className="bg-white text-green-700 font-bold px-6 py-3 rounded-lg hover:bg-green-50 transition flex items-center gap-2">
                Faire une demande <PlusCircle size={16} />
              </Link>
              <Link to="/connexion"
                className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition">
                Se connecter
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              {[
                { Icon: Clock, label: '24h/24', desc: 'Service accessible à tout moment' },
                { Icon: Shield, label: 'Sécurisé', desc: 'Données protégées' },
                { Icon: Smartphone, label: 'Mobile', desc: 'Sur tous vos appareils' },
              ].map(({ Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={20} color="white" />
                  <div>
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-green-200 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card démo */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <p className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-green-600" /> Commencer rapidement
              </p>
              <div className="space-y-3">
                {[
                  { Icon: Baby, label: 'Acte de naissance', couleur: 'bg-blue-100 text-blue-600' },
                  { Icon: Home, label: 'Certificat de résidence', couleur: 'bg-green-100 text-green-600' },
                  { Icon: Heart, label: 'Acte de mariage', couleur: 'bg-pink-100 text-pink-600' },
                ].map(({ Icon, label, couleur }) => (
                  <div key={label} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${couleur}`}>
                        <Icon size={15} />
                      </div>
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">En ligne</span>
                  </div>
                ))}
              </div>
              <Link to="/inscription"
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition block text-center">
                Créer mon compte gratuit
              </Link>
            </div>
          </div>
        </div>

        {/* Vague */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 0 960 60 720 30C480 0 240 60 0 30L0 60Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* SERVICES */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Nos Services</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Accédez à l'ensemble des services administratifs des mairies de Douala en quelques clics
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map(({ Icon, couleur, label, desc, key }) => (
            <Link to="/inscription" key={key}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-green-200 transition group">
              <div className={`w-12 h-12 ${couleur} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={22} color="white" strokeWidth={1.8} />
              </div>
              <p className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-green-700">{label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ARRONDISSEMENTS */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Arrondissements de Douala</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {arrondissements.map((arr) => (
              <div key={arr}
                className="bg-white rounded-xl px-5 py-4 flex items-center gap-3 border border-gray-100 hover:border-green-300 hover:shadow-sm transition cursor-pointer">
                <MapPin size={16} className="text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{arr}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/inscription"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Commencer une demande
            </Link>
          </div>
        </div>
      </div>

      {/* COMMENT CA MARCHE */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {etapes.map(({ step, Icon, title, desc }) => (
            <div key={step} className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mb-4 text-sm">
                {step}
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <Icon size={22} className="text-green-600" />
              </div>
              <p className="font-semibold text-gray-800 mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <FileText size={16} color="white" />
              </div>
              <p className="font-bold text-white">e-Mairie Douala</p>
            </div>
            <p className="text-sm leading-relaxed">
              Portail officiel de la Ville de Douala pour faciliter vos démarches administratives en ligne.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Liens Rapides</p>
            <div className="space-y-2 text-sm">
              <p className="hover:text-white cursor-pointer">Services en ligne</p>
              <p className="hover:text-white cursor-pointer">Guides et tutoriels</p>
              <p className="hover:text-white cursor-pointer">FAQ</p>
              <p className="hover:text-white cursor-pointer">Conditions d'utilisation</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Contact</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><MapPin size={13} /> Hôtel de Ville, Douala</div>
              <div className="flex items-center gap-2"><Smartphone size={13} /> +237 233 42 66 00</div>
              <div className="flex items-center gap-2"><FileText size={13} /> contact@douala.cm</div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white mb-3">Horaires</p>
            <div className="space-y-2 text-sm">
              <p>Lundi - Vendredi</p>
              <p>7h30 - 15h30</p>
              <p className="text-green-400 font-semibold flex items-center gap-1">
                <Clock size={13} /> Service en ligne 24h/24
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-8 pt-6 flex justify-between items-center text-sm">
          <p>© 2026 Communauté Urbaine de Douala. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Facebook size={18} className="hover:text-white cursor-pointer" />
            <Twitter size={18} className="hover:text-white cursor-pointer" />
            <Instagram size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>

      <AssistantIA />
    </div>
  );
}

