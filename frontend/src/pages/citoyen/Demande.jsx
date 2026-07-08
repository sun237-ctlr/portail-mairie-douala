import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creerDemande, uploadDocuments } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Baby, Heart, Cross, Home, CheckSquare, Briefcase,
  FileCheck, MapPin, Flag, Users, Camera, Folder,
  CheckCircle, ArrowLeft, Building2, AlertCircle
} from 'lucide-react';

const ACTES_CONFIG = {
  ACTE_NAISSANCE: {
    label: 'Acte de naissance', Icon: Baby, couleur: 'bg-blue-500',
    champs: [
      { name: 'nomEnfant', label: "Nom de l'enfant", type: 'text' },
      { name: 'prenomEnfant', label: "Prénom de l'enfant", type: 'text' },
      { name: 'dateNaissance', label: 'Date de naissance', type: 'date' },
      { name: 'lieuNaissance', label: 'Lieu de naissance', type: 'text' },
      { name: 'nomPere', label: 'Nom complet du père', type: 'text' },
      { name: 'nomMere', label: 'Nom complet de la mère', type: 'text' },
      { name: 'parents', label: 'Parents mariés ?', type: 'select', options: ['Oui', 'Non'] },
    ],
    documents: [
      'Déclaration de naissance (hôpital)',
      'CNI du père', 'CNI de la mère',
      'Acte de mariage (si mariés) ou CNI de 2 témoins (si non mariés)',
    ],
  },
  ACTE_MARIAGE: {
    label: 'Acte de mariage', Icon: Heart, couleur: 'bg-pink-500',
    champs: [
      { name: 'nomEpoux', label: "Nom complet de l'époux", type: 'text' },
      { name: 'nomEpouse', label: "Nom complet de l'épouse", type: 'text' },
      { name: 'dateMariage', label: 'Date du mariage', type: 'date' },
      { name: 'lieuMariage', label: 'Lieu du mariage', type: 'text' },
    ],
    documents: ["CNI de l'époux", "CNI de l'épouse", "Acte de naissance époux", "Acte de naissance épouse"],
  },
  ACTE_DECES: {
    label: 'Acte de décès', Icon: Cross, couleur: 'bg-gray-500',
    champs: [
      { name: 'nomDefunt', label: 'Nom complet du défunt', type: 'text' },
      { name: 'dateDeces', label: 'Date du décès', type: 'date' },
      { name: 'lieuDeces', label: 'Lieu du décès', type: 'text' },
      { name: 'nomDeclarant', label: 'Nom du déclarant', type: 'text' },
    ],
    documents: ["CNI du défunt", "Certificat médical de décès", "CNI du déclarant"],
  },
  CERTIFICAT_RESIDENCE: {
    label: 'Certificat de résidence', Icon: Home, couleur: 'bg-green-500',
    champs: [
      { name: 'nomComplet', label: 'Nom complet', type: 'text' },
      { name: 'adresse', label: 'Adresse complète', type: 'text' },
      { name: 'quartier', label: 'Quartier', type: 'text' },
      { name: 'dureeResidence', label: 'Durée de résidence', type: 'text' },
    ],
    documents: ["CNI du demandeur", "Facture d'eau ou électricité récente"],
  },
  CERTIFICAT_VIE: {
    label: 'Certificat de vie', Icon: CheckSquare, couleur: 'bg-teal-500',
    champs: [
      { name: 'nomComplet', label: 'Nom complet', type: 'text' },
      { name: 'dateNaissance', label: 'Date de naissance', type: 'date' },
      { name: 'lieuNaissance', label: 'Lieu de naissance', type: 'text' },
    ],
    documents: ["CNI du demandeur"],
  },
  CERTIFICAT_CELIBAT: {
    label: 'Certificat de célibat', Icon: Briefcase, couleur: 'bg-orange-500',
    champs: [
      { name: 'nomComplet', label: 'Nom complet', type: 'text' },
      { name: 'dateNaissance', label: 'Date de naissance', type: 'date' },
      { name: 'lieuNaissance', label: 'Lieu de naissance', type: 'text' },
      { name: 'profession', label: 'Profession', type: 'text' },
    ],
    documents: ["CNI du demandeur", "Acte de naissance"],
  },
  LEGALISATION_DOCUMENTS: {
    label: 'Légalisation de documents', Icon: FileCheck, couleur: 'bg-purple-500',
    champs: [
      { name: 'nomComplet', label: 'Nom complet', type: 'text' },
      { name: 'typeDocument', label: 'Type de document à légaliser', type: 'text' },
      { name: 'nombreCopies', label: 'Nombre de copies', type: 'number' },
    ],
    documents: ["CNI du demandeur", "Document original à légaliser"],
  },
  ATTESTATION_DOMICILE: {
    label: 'Attestation de domicile', Icon: MapPin, couleur: 'bg-red-500',
    champs: [
      { name: 'nomComplet', label: 'Nom complet', type: 'text' },
      { name: 'adresse', label: 'Adresse complète', type: 'text' },
      { name: 'quartier', label: 'Quartier', type: 'text' },
    ],
    documents: ["CNI du demandeur", "Facture récente (eau/électricité)"],
  },
  CERTIFICAT_NATIONALITE: {
    label: 'Certificat de nationalité', Icon: Flag, couleur: 'bg-yellow-500',
    champs: [
      { name: 'nomComplet', label: 'Nom complet', type: 'text' },
      { name: 'dateNaissance', label: 'Date de naissance', type: 'date' },
      { name: 'lieuNaissance', label: 'Lieu de naissance', type: 'text' },
      { name: 'nomPere', label: 'Nom du père', type: 'text' },
    ],
    documents: ["CNI du demandeur", "Acte de naissance", "CNI du père"],
  },
  AUTORISATION_PARENTALE: {
    label: 'Autorisation parentale', Icon: Users, couleur: 'bg-indigo-500',
    champs: [
      { name: 'nomEnfant', label: "Nom complet de l'enfant", type: 'text' },
      { name: 'dateNaissanceEnfant', label: "Date de naissance de l'enfant", type: 'date' },
      { name: 'nomParent', label: 'Nom du parent/tuteur', type: 'text' },
      { name: 'motif', label: "Motif de l'autorisation", type: 'text' },
      { name: 'destination', label: 'Destination / Objet', type: 'text' },
    ],
    documents: ["CNI du parent/tuteur", "Acte de naissance de l'enfant"],
  },
};

export default function Demande() {
  const navigate = useNavigate();
  const { utilisateur } = useAuth();
  const [etape, setEtape] = useState(1);
  const [typeActe, setTypeActe] = useState('');
  const [formData, setFormData] = useState({});
  const [erreursChamps, setEreursChamps] = useState({});
  const [fichiers, setFichiers] = useState({});
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);
  const [codeUnique, setCodeUnique] = useState('');

  const config = ACTES_CONFIG[typeActe];

  const handleChamp = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (erreursChamps[e.target.name]) {
      setEreursChamps(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleFichier = (index, file) => {
    if (file) setFichiers(prev => ({ ...prev, [index]: file }));
  };

  const supprimerFichier = (index) => {
    setFichiers(prev => { const c = { ...prev }; delete c[index]; return c; });
  };

  const validerEtape2 = () => {
    const erreurs = {};
    config.champs.forEach(champ => {
      const valeur = formData[champ.name];
      if (!valeur || valeur.toString().trim() === '') {
        erreurs[champ.name] = 'Ce champ est obligatoire';
      }
    });
    if (Object.keys(erreurs).length > 0) {
      setEreursChamps(erreurs);
      return false;
    }
    setEreursChamps({});
    return true;
  };

  const handleSubmit = async () => {
    setErreur('');
    setChargement(true);
    try {
      const res = await creerDemande({ typeActe, donnees: formData });
      const demandeId = res.data.demande.id;
      const code = res.data.demande.codeUnique;

      const fichiersListe = Object.entries(fichiers);
      if (fichiersListe.length > 0) {
        const fd = new FormData();
        fichiersListe.forEach(([index, file]) => {
          fd.append('documents', file);
          fd.append('noms', config.documents[index]);
        });
        await uploadDocuments(demandeId, fd);
      }

      setCodeUnique(code);
      setSucces(true);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setChargement(false);
    }
  };

  if (!utilisateur) { navigate('/connexion'); return null; }

  if (succes) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Demande soumise !</h2>
        <p className="text-gray-500 mb-4">Votre demande a été transmise à la mairie.</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-green-700 mb-1">Votre code de suivi</p>
          <p className="text-2xl font-bold text-green-700 tracking-widest font-mono">{codeUnique}</p>
          <p className="text-xs text-green-600 mt-1">Conservez ce code — il a été envoyé par email</p>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition w-full">
          Voir mes demandes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 size={20} />
          <span className="font-bold">Mairie de Douala</span>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-sm border border-white border-opacity-50 px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
          <ArrowLeft size={14} /> Retour
        </button>
      </nav>

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Choisir', 'Formulaire', 'Documents'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                ${etape >= i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {etape > i + 1 ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${etape === i + 1 ? 'text-green-700' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* ÉTAPE 1 — Choisir l'acte */}
          {etape === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Choisissez votre acte</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(ACTES_CONFIG).map(([key, val]) => {
                  const IconActe = val.Icon;
                  return (
                    <button key={key} onClick={() => setTypeActe(key)}
                      className={`p-4 rounded-xl border-2 text-left transition flex items-center gap-3
                        ${typeActe === key ? 'border-green-600 bg-green-50' : 'border-gray-100 hover:border-green-300'}`}>
                      <div className={`w-10 h-10 ${val.couleur} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconActe size={18} color="white" strokeWidth={1.8} />
                      </div>
                      <p className="text-xs font-medium text-gray-700 leading-tight">{val.label}</p>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => { if (typeActe) setEtape(2); }}
                disabled={!typeActe}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
                Continuer →
              </button>
            </>
          )}

          {/* ÉTAPE 2 — Formulaire */}
          {etape === 2 && config && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${config.couleur} rounded-xl flex items-center justify-center`}>
                  <config.Icon size={20} color="white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{config.label}</h2>
              </div>

              {Object.keys(erreursChamps).some(k => erreursChamps[k]) && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">Veuillez remplir tous les champs obligatoires avant de continuer.</p>
                </div>
              )}

              <div className="space-y-4">
                {config.champs.map((champ) => (
                  <div key={champ.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {champ.label} <span className="text-red-500">*</span>
                    </label>
                    {champ.type === 'select' ? (
                      <select
                        name={champ.name}
                        value={formData[champ.name] || ''}
                        onChange={handleChamp}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition
                          ${erreursChamps[champ.name] ? 'border-red-400 bg-red-50 focus:ring-red-400' : 'border-gray-200'}`}>
                        <option value="">Sélectionner...</option>
                        {champ.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        type={champ.type}
                        name={champ.name}
                        value={formData[champ.name] || ''}
                        onChange={handleChamp}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition
                          ${erreursChamps[champ.name] ? 'border-red-400 bg-red-50 focus:ring-red-400' : 'border-gray-200'}`}
                      />
                    )}
                    {erreursChamps[champ.name] && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle size={12} className="text-red-500" />
                        <p className="text-red-500 text-xs">{erreursChamps[champ.name]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => { setEtape(1); setEreursChamps({}); }}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Retour
                </button>
                <button onClick={() => { if (validerEtape2()) setEtape(3); }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                  Continuer →
                </button>
              </div>
            </>
          )}

          {/* ÉTAPE 3 — Documents */}
          {etape === 3 && config && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Documents à fournir</h2>
              <p className="text-gray-500 text-sm mb-5">Scannez ou photographiez chaque document requis</p>

              <div className="space-y-4 mb-6">
                {config.documents.map((doc, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck size={16} className="text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{doc}</span>
                      {fichiers[i] && (
                        <span className="ml-auto flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <CheckCircle size={13} /> Ajouté
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl py-2.5 px-3 hover:bg-blue-100 transition">
                          <Camera size={16} className="text-blue-600" />
                          <span className="text-xs text-blue-700 font-medium">Prendre photo</span>
                        </div>
                        <input type="file" accept="image/*" capture="environment" className="hidden"
                          onChange={(e) => handleFichier(i, e.target.files[0])} />
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 border-2 border-dashed border-green-200 bg-green-50 rounded-xl py-2.5 px-3 hover:bg-green-100 transition">
                          <Folder size={16} className="text-green-600" />
                          <span className="text-xs text-green-700 font-medium">Scanner / PDF</span>
                        </div>
                        <input type="file" accept="image/*,application/pdf" className="hidden"
                          onChange={(e) => handleFichier(i, e.target.files[0])} />
                      </label>
                    </div>
                    {fichiers[i] && (
                      <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                        <span className="text-xs text-gray-600 truncate">{fichiers[i].name}</span>
                        <button onClick={() => supprimerFichier(i)}
                          className="text-red-500 text-xs ml-2 hover:text-red-700 flex items-center gap-1">
                          <Cross size={12} /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {erreur && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-sm text-red-700">{erreur}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6">
                <p className="text-sm text-yellow-800">
                  En soumettant, vous confirmez que toutes les informations sont exactes et authentiques.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEtape(2)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Retour
                </button>
                <button onClick={handleSubmit} disabled={chargement}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition">
                  <CheckCircle size={16} /> {chargement ? 'Envoi...' : 'Soumettre'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
