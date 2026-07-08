import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creerDemande, uploadDocuments } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLangue } from '../../context/LangueContext';
import {
  Baby, Heart, Cross, Home, CheckSquare, Briefcase,
  FileCheck, MapPin, Flag, Users, Camera, Folder,
  CheckCircle, ArrowLeft, Building2, AlertCircle
} from 'lucide-react';

export default function Demande() {
  const navigate = useNavigate();
  const { utilisateur } = useAuth();
  const { t } = useLangue();

  const ACTES_CONFIG = {
    ACTE_NAISSANCE: {
      label: t.acteNaissance, Icon: Baby, couleur: 'bg-blue-500',
      champs: [
        { name: 'nomEnfant', label: t.langue === 'en' ? "Child's last name" : "Nom de l'enfant", type: 'text' },
        { name: 'prenomEnfant', label: t.langue === 'en' ? "Child's first name" : "Prénom de l'enfant", type: 'text' },
        { name: 'dateNaissance', label: t.langue === 'en' ? 'Date of birth' : 'Date de naissance', type: 'date' },
        { name: 'lieuNaissance', label: t.langue === 'en' ? 'Place of birth' : 'Lieu de naissance', type: 'text' },
        { name: 'nomPere', label: t.langue === 'en' ? "Father's full name" : 'Nom complet du père', type: 'text' },
        { name: 'nomMere', label: t.langue === 'en' ? "Mother's full name" : 'Nom complet de la mère', type: 'text' },
        { name: 'parents', label: t.langue === 'en' ? 'Married parents?' : 'Parents mariés ?', type: 'select', options: [t.langue === 'en' ? 'Yes' : 'Oui', t.langue === 'en' ? 'No' : 'Non'] },
      ],
      documents: t.langue === 'en' ? [
        'Birth declaration (hospital)',
        "Father's NIC", "Mother's NIC",
        'Marriage certificate (if married) or 2 witnesses NIC (if not married)',
      ] : [
        'Déclaration de naissance (hôpital)',
        'CNI du père', 'CNI de la mère',
        'Acte de mariage (si mariés) ou CNI de 2 témoins (si non mariés)',
      ],
    },
    ACTE_MARIAGE: {
      label: t.acteMariage, Icon: Heart, couleur: 'bg-pink-500',
      champs: [
        { name: 'nomEpoux', label: t.langue === 'en' ? "Husband's full name" : "Nom complet de l'époux", type: 'text' },
        { name: 'nomEpouse', label: t.langue === 'en' ? "Wife's full name" : "Nom complet de l'épouse", type: 'text' },
        { name: 'dateMariage', label: t.langue === 'en' ? 'Wedding date' : 'Date du mariage', type: 'date' },
        { name: 'lieuMariage', label: t.langue === 'en' ? 'Wedding location' : 'Lieu du mariage', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Husband's NIC", "Wife's NIC", "Husband's birth certificate", "Wife's birth certificate"] :
        ["CNI de l'époux", "CNI de l'épouse", "Acte de naissance époux", "Acte de naissance épouse"],
    },
    ACTE_DECES: {
      label: t.acteDeces, Icon: Cross, couleur: 'bg-gray-500',
      champs: [
        { name: 'nomDefunt', label: t.langue === 'en' ? "Deceased's full name" : 'Nom complet du défunt', type: 'text' },
        { name: 'dateDeces', label: t.langue === 'en' ? 'Date of death' : 'Date du décès', type: 'date' },
        { name: 'lieuDeces', label: t.langue === 'en' ? 'Place of death' : 'Lieu du décès', type: 'text' },
        { name: 'nomDeclarant', label: t.langue === 'en' ? "Declarant's name" : 'Nom du déclarant', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Deceased's NIC", "Medical death certificate", "Declarant's NIC"] :
        ["CNI du défunt", "Certificat médical de décès", "CNI du déclarant"],
    },
    CERTIFICAT_RESIDENCE: {
      label: t.certResidence, Icon: Home, couleur: 'bg-green-500',
      champs: [
        { name: 'nomComplet', label: t.langue === 'en' ? 'Full name' : 'Nom complet', type: 'text' },
        { name: 'adresse', label: t.langue === 'en' ? 'Full address' : 'Adresse complète', type: 'text' },
        { name: 'quartier', label: t.langue === 'en' ? 'Neighborhood' : 'Quartier', type: 'text' },
        { name: 'dureeResidence', label: t.langue === 'en' ? 'Length of residence' : 'Durée de résidence', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Applicant's NIC", "Recent water or electricity bill"] :
        ["CNI du demandeur", "Facture d'eau ou électricité récente"],
    },
    CERTIFICAT_VIE: {
      label: t.certVie, Icon: CheckSquare, couleur: 'bg-teal-500',
      champs: [
        { name: 'nomComplet', label: t.langue === 'en' ? 'Full name' : 'Nom complet', type: 'text' },
        { name: 'dateNaissance', label: t.langue === 'en' ? 'Date of birth' : 'Date de naissance', type: 'date' },
        { name: 'lieuNaissance', label: t.langue === 'en' ? 'Place of birth' : 'Lieu de naissance', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Applicant's NIC"] : ["CNI du demandeur"],
    },
    CERTIFICAT_CELIBAT: {
      label: t.certCelibat, Icon: Briefcase, couleur: 'bg-orange-500',
      champs: [
        { name: 'nomComplet', label: t.langue === 'en' ? 'Full name' : 'Nom complet', type: 'text' },
        { name: 'dateNaissance', label: t.langue === 'en' ? 'Date of birth' : 'Date de naissance', type: 'date' },
        { name: 'lieuNaissance', label: t.langue === 'en' ? 'Place of birth' : 'Lieu de naissance', type: 'text' },
        { name: 'profession', label: t.langue === 'en' ? 'Occupation' : 'Profession', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Applicant's NIC", "Birth certificate"] : ["CNI du demandeur", "Acte de naissance"],
    },
    LEGALISATION_DOCUMENTS: {
      label: t.legalisation, Icon: FileCheck, couleur: 'bg-purple-500',
      champs: [
        { name: 'nomComplet', label: t.langue === 'en' ? 'Full name' : 'Nom complet', type: 'text' },
        { name: 'typeDocument', label: t.langue === 'en' ? 'Type of document to legalize' : 'Type de document à légaliser', type: 'text' },
        { name: 'nombreCopies', label: t.langue === 'en' ? 'Number of copies' : 'Nombre de copies', type: 'number' },
      ],
      documents: t.langue === 'en' ? ["Applicant's NIC", "Original document to legalize"] :
        ["CNI du demandeur", "Document original à légaliser"],
    },
    ATTESTATION_DOMICILE: {
      label: t.attestDomicile, Icon: MapPin, couleur: 'bg-red-500',
      champs: [
        { name: 'nomComplet', label: t.langue === 'en' ? 'Full name' : 'Nom complet', type: 'text' },
        { name: 'adresse', label: t.langue === 'en' ? 'Full address' : 'Adresse complète', type: 'text' },
        { name: 'quartier', label: t.langue === 'en' ? 'Neighborhood' : 'Quartier', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Applicant's NIC", "Recent bill (water/electricity)"] :
        ["CNI du demandeur", "Facture récente (eau/électricité)"],
    },
    CERTIFICAT_NATIONALITE: {
      label: t.certNationalite, Icon: Flag, couleur: 'bg-yellow-500',
      champs: [
        { name: 'nomComplet', label: t.langue === 'en' ? 'Full name' : 'Nom complet', type: 'text' },
        { name: 'dateNaissance', label: t.langue === 'en' ? 'Date of birth' : 'Date de naissance', type: 'date' },
        { name: 'lieuNaissance', label: t.langue === 'en' ? 'Place of birth' : 'Lieu de naissance', type: 'text' },
        { name: 'nomPere', label: t.langue === 'en' ? "Father's name" : 'Nom du père', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Applicant's NIC", "Birth certificate", "Father's NIC"] :
        ["CNI du demandeur", "Acte de naissance", "CNI du père"],
    },
    AUTORISATION_PARENTALE: {
      label: t.autoParentale, Icon: Users, couleur: 'bg-indigo-500',
      champs: [
        { name: 'nomEnfant', label: t.langue === 'en' ? "Child's full name" : "Nom complet de l'enfant", type: 'text' },
        { name: 'dateNaissanceEnfant', label: t.langue === 'en' ? "Child's date of birth" : "Date de naissance de l'enfant", type: 'date' },
        { name: 'nomParent', label: t.langue === 'en' ? 'Parent/guardian name' : 'Nom du parent/tuteur', type: 'text' },
        { name: 'motif', label: t.langue === 'en' ? 'Purpose of authorization' : "Motif de l'autorisation", type: 'text' },
        { name: 'destination', label: t.langue === 'en' ? 'Destination / Purpose' : 'Destination / Objet', type: 'text' },
      ],
      documents: t.langue === 'en' ? ["Parent/guardian NIC", "Child's birth certificate"] :
        ["CNI du parent/tuteur", "Acte de naissance de l'enfant"],
    },
  };

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
        erreurs[champ.name] = t.champObligatoire;
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.demandesoumise}</h2>
        <p className="text-gray-500 mb-4">{t.demandeTransmise}</p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-green-700 mb-1">{t.votrecode}</p>
          <p className="text-2xl font-bold text-green-700 tracking-widest font-mono">{codeUnique}</p>
          <p className="text-xs text-green-600 mt-1">{t.conserverCode}</p>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition w-full">
          {t.voirMesDemandes}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 size={20} />
          <span className="font-bold">e-Mairie Douala</span>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-sm border border-white border-opacity-50 px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
          <ArrowLeft size={14} /> {t.retour}
        </button>
      </nav>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[t.choisir, t.formulaire, t.documents].map((label, i) => (
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
          {/* ÉTAPE 1 */}
          {etape === 1 && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t.choisirActe}</h2>
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
                {t.continuer}
              </button>
            </>
          )}

          {/* ÉTAPE 2 */}
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
                  <p className="text-sm text-red-700">{t.remplirChamps}</p>
                </div>
              )}

              <div className="space-y-4">
                {config.champs.map((champ) => (
                  <div key={champ.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {champ.label} <span className="text-red-500">*</span>
                    </label>
                    {champ.type === 'select' ? (
                      <select name={champ.name} value={formData[champ.name] || ''} onChange={handleChamp}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition
                          ${erreursChamps[champ.name] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                        <option value="">{t.langue === 'en' ? 'Select...' : 'Sélectionner...'}</option>
                        {champ.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={champ.type} name={champ.name} value={formData[champ.name] || ''} onChange={handleChamp}
                        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition
                          ${erreursChamps[champ.name] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
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
                  <ArrowLeft size={16} /> {t.retour}
                </button>
                <button onClick={() => { if (validerEtape2()) setEtape(3); }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                  {t.continuer}
                </button>
              </div>
            </>
          )}

          {/* ÉTAPE 3 */}
          {etape === 3 && config && (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t.documentsAFournir}</h2>
              <p className="text-gray-500 text-sm mb-5">{t.scannerPhotographier}</p>

              <div className="space-y-4 mb-6">
                {config.documents.map((doc, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck size={16} className="text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{doc}</span>
                      {fichiers[i] && (
                        <span className="ml-auto flex items-center gap-1 text-green-600 text-xs font-semibold">
                          <CheckCircle size={13} /> {t.langue === 'en' ? 'Added' : 'Ajouté'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl py-2.5 px-3 hover:bg-blue-100 transition">
                          <Camera size={16} className="text-blue-600" />
                          <span className="text-xs text-blue-700 font-medium">{t.prendrePhoto}</span>
                        </div>
                        <input type="file" accept="image/*" capture="environment" className="hidden"
                          onChange={(e) => handleFichier(i, e.target.files[0])} />
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 border-2 border-dashed border-green-200 bg-green-50 rounded-xl py-2.5 px-3 hover:bg-green-100 transition">
                          <Folder size={16} className="text-green-600" />
                          <span className="text-xs text-green-700 font-medium">{t.scannerPDF}</span>
                        </div>
                        <input type="file" accept="image/*,application/pdf" className="hidden"
                          onChange={(e) => handleFichier(i, e.target.files[0])} />
                      </label>
                    </div>
                    {fichiers[i] && (
                      <div className="mt-2 flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                        <span className="text-xs text-gray-600 truncate">{fichiers[i].name}</span>
                        <button onClick={() => supprimerFichier(i)}
                          className="text-red-500 text-xs ml-2 hover:text-red-700">
                          {t.langue === 'en' ? 'Remove' : 'Supprimer'}
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
                <p className="text-sm text-yellow-800">{t.confirmationSoumission}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEtape(2)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> {t.retour}
                </button>
                <button onClick={handleSubmit} disabled={chargement}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition">
                  <CheckCircle size={16} /> {chargement ? t.envoiEnCours : t.soumettre}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
