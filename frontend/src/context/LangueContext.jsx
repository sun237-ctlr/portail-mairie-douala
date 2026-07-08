import { createContext, useContext, useState } from 'react';

const LangueContext = createContext();

export const traductions = {
  fr: {
    // Navbar
    accueil: 'Accueil',
    nouvelleDemande: 'Nouvelle Demande',
    mesDemandes: 'Mes Demandes',
    recupererActe: 'Récupérer Acte',
    aide: 'Aide',
    seConnecter: 'Se connecter',
    deconnexion: 'Déconnexion',

    // Hero
    serviceVille: 'Service de la Ville de Douala',
    titreHero: 'Demandez vos actes\nadministratifs\nen ligne',
    descHero: 'Un portail moderne et sécurisé pour faciliter vos démarches administratives. Simple, rapide et accessible 24h/24.',
    faireUneDemande: 'Faire une demande',
    disponible: '24h/24',
    serviceDisponible: 'Service accessible à tout moment',
    securise: 'Sécurisé',
    donneesProtegees: 'Données protégées',
    mobile: 'Mobile',
    tousAppareils: 'Sur tous vos appareils',
    commencerRapidement: 'Commencer rapidement',
    creerCompteGratuit: 'Créer mon compte gratuit',
    enLigne: 'En ligne',

    // Services
    nosServices: 'Nos Services',
    descServices: "Accédez à l'ensemble des services administratifs des mairies de Douala en quelques clics",

    // Arrondissements
    arrondissements: 'Arrondissements de Douala',
    commencerDemande: 'Commencer une demande',

    // Comment ça marche
    commentCaMarche: 'Comment ça marche ?',
    etape1Titre: 'Créez un compte',
    etape1Desc: 'Inscrivez-vous gratuitement en quelques minutes',
    etape2Titre: 'Choisissez votre acte',
    etape2Desc: 'Sélectionnez parmi nos 10 actes disponibles',
    etape3Titre: 'Joignez vos documents',
    etape3Desc: 'Scannez ou photographiez vos pièces justificatives',
    etape4Titre: 'Récupérez votre acte',
    etape4Desc: 'Venez chercher votre acte à la mairie au rendez-vous',

    // Footer
    liensRapides: 'Liens Rapides',
    servicesEnLigne: 'Services en ligne',
    guidesTutoriels: 'Guides et tutoriels',
    faq: 'FAQ',
    conditionsUtilisation: "Conditions d'utilisation",
    contact: 'Contact',
    horaires: 'Horaires',
    lundiVendredi: 'Lundi - Vendredi',
    serviceEnLigne: 'Service en ligne 24h/24',
    droitsReserves: '© 2026 Communauté Urbaine de Douala. Tous droits réservés.',

    // Connexion
    connexion: 'Connexion',
    pasDeCompte: "Pas encore de compte ?",
    sInscrireGratuitement: "S'inscrire gratuitement",
    adresseEmail: 'Adresse email',
    motDePasse: 'Mot de passe',
    motDePasseOublie: 'Mot de passe oublié ?',
    seConnecterBtn: 'Se connecter',
    connexionEnCours: 'Connexion...',
    accesGestionnaire: 'Accès gestionnaire mairie →',
    bienvenue: 'Bienvenue sur votre portail administratif',
    descConnexion: 'Connectez-vous pour accéder à vos demandes et suivre leur avancement en temps réel.',

    // Inscription
    creerUnCompte: 'Créer un compte',
    dejaInscrit: 'Déjà inscrit ?',
    seConnecter2: 'Se connecter',
    nom: 'Nom',
    prenom: 'Prénom',
    telephone: 'Téléphone',
    creerMonCompte: 'Créer mon compte',
    creationEnCours: 'Création en cours...',
    cniObligatoire: 'Carte Nationale d\'Identité (CNI) *',
    recto: 'Recto',
    verso: 'Verso',
    prendrePhoto: 'Prendre photo',
    scannerPDF: 'Scanner / PDF',
    inscriptionSecurisee: 'Inscription sécurisée',
    descInscription: 'Votre CNI est requise pour garantir l\'authenticité de vos demandes administratives.',
    cniRecto: 'CNI recto/verso obligatoire',
    codeUnique: 'Code unique pour chaque demande',
    qrCode: 'QR code envoyé par email',
    verificationSansConnexion: 'Vérification possible sans connexion',

    // Dashboard
    mesDemandes2: 'Mes demandes',
    bonjour: 'Bonjour',
    gererDemandes: 'Gérez vos demandes d\'actes administratifs',
    nouvelleDemande2: 'Nouvelle demande',
    total: 'Total',
    enAttente: 'En Attente',
    enTraitement: 'En Traitement',
    terminees: 'Terminées',
    rechercherDemande: 'Rechercher par type ou référence...',
    filtresAvances: 'Filtres avancés',
    aucuneDemande: 'Aucune demande trouvée',
    commencerPremiere: 'Commencez par faire votre première demande',
    soumiseLe: 'Soumise le',
    motifRejet: 'Motif de rejet :',
    rendezVousLe: 'Rendez-vous le :',
    acteDisponibleLe: 'Acte disponible le :',

    // Demande
    choisirActe: 'Choisissez votre acte',
    choisir: 'Choisir',
    formulaire: 'Formulaire',
    documents: 'Documents',
    continuer: 'Continuer →',
    retour: 'Retour',
    documentsAFournir: 'Documents à fournir',
    scannerPhotographier: 'Scannez ou photographiez chaque document requis',
    soumettre: 'Soumettre',
    envoiEnCours: 'Envoi...',
    demandesoumise: 'Demande soumise !',
    demandeTransmise: 'Votre demande a été transmise à la mairie.',
    votrecode: 'Votre code de suivi',
    conserverCode: 'Conservez ce code — il a été envoyé par email',
    voirMesDemandes: 'Voir mes demandes',
    champObligatoire: 'Ce champ est obligatoire',
    remplirChamps: 'Veuillez remplir tous les champs obligatoires avant de continuer.',
    confirmationSoumission: 'En soumettant, vous confirmez que toutes les informations sont exactes et authentiques.',

    // Actes
    acteNaissance: 'Acte de naissance',
    acteMariage: 'Acte de mariage',
    acteDeces: 'Acte de décès',
    certResidence: 'Certificat de résidence',
    certVie: 'Certificat de vie',
    certCelibat: 'Certificat de célibat',
    legalisation: 'Légalisation de documents',
    attestDomicile: 'Attestation de domicile',
    certNationalite: 'Certificat de nationalité',
    autoParentale: 'Autorisation parentale',

    // Récupérer acte
    verifierActe: 'Vérifier mon acte',
    descVerifier: 'Entrez votre code de suivi reçu par email pour vérifier si votre acte est disponible',
    codesuivi: 'Entrez votre code de suivi',
    codeSuivi: 'Code de suivi *',
    verifier: 'Vérifier',
    codeFormat: 'Code à 8 caractères reçu par email lors de votre demande',
    ouTrouverCode: 'Où trouver mon code de suivi ?',

    // Aide
    centreAide: "Centre d'Aide",
    descAide: 'Trouvez des réponses à vos questions sur les services de la plateforme e-Mairie Douala',
    rechercherQuestions: 'Rechercher dans les questions fréquentes...',

    // Statuts
    statutEnAttente: 'En attente',
    statutVerification: 'En traitement',
    statutAccepte: 'Terminée',
    statutRejete: 'Rejetée',
    statutRdv: 'RDV programmé',
    statutDisponible: 'Disponible',
  },

  en: {
    // Navbar
    accueil: 'Home',
    nouvelleDemande: 'New Request',
    mesDemandes: 'My Requests',
    recupererActe: 'Retrieve Document',
    aide: 'Help',
    seConnecter: 'Sign In',
    deconnexion: 'Sign Out',

    // Hero
    serviceVille: 'City of Douala Service',
    titreHero: 'Request your\nadministrative\ndocuments online',
    descHero: 'A modern and secure portal to facilitate your administrative procedures. Simple, fast and accessible 24/7.',
    faireUneDemande: 'Make a request',
    disponible: '24/7',
    serviceDisponible: 'Service available at any time',
    securise: 'Secure',
    donneesProtegees: 'Protected data',
    mobile: 'Mobile',
    tousAppareils: 'On all your devices',
    commencerRapidement: 'Start quickly',
    creerCompteGratuit: 'Create my free account',
    enLigne: 'Online',

    // Services
    nosServices: 'Our Services',
    descServices: 'Access all administrative services from Douala municipalities in just a few clicks',

    // Arrondissements
    arrondissements: 'Districts of Douala',
    commencerDemande: 'Start a request',

    // Comment ça marche
    commentCaMarche: 'How does it work?',
    etape1Titre: 'Create an account',
    etape1Desc: 'Register for free in just a few minutes',
    etape2Titre: 'Choose your document',
    etape2Desc: 'Select from our 10 available documents',
    etape3Titre: 'Attach your documents',
    etape3Desc: 'Scan or photograph your supporting documents',
    etape4Titre: 'Collect your document',
    etape4Desc: 'Come pick up your document at the town hall',

    // Footer
    liensRapides: 'Quick Links',
    servicesEnLigne: 'Online services',
    guidesTutoriels: 'Guides & tutorials',
    faq: 'FAQ',
    conditionsUtilisation: 'Terms of use',
    contact: 'Contact',
    horaires: 'Opening hours',
    lundiVendredi: 'Monday - Friday',
    serviceEnLigne: 'Online service 24/7',
    droitsReserves: '© 2026 Urban Community of Douala. All rights reserved.',

    // Connexion
    connexion: 'Sign In',
    pasDeCompte: 'No account yet?',
    sInscrireGratuitement: 'Register for free',
    adresseEmail: 'Email address',
    motDePasse: 'Password',
    motDePasseOublie: 'Forgot password?',
    seConnecterBtn: 'Sign In',
    connexionEnCours: 'Signing in...',
    accesGestionnaire: 'Town hall administrator access →',
    bienvenue: 'Welcome to your administrative portal',
    descConnexion: 'Sign in to access your requests and track their progress in real time.',

    // Inscription
    creerUnCompte: 'Create an account',
    dejaInscrit: 'Already registered?',
    seConnecter2: 'Sign in',
    nom: 'Last name',
    prenom: 'First name',
    telephone: 'Phone',
    creerMonCompte: 'Create my account',
    creationEnCours: 'Creating...',
    cniObligatoire: 'National Identity Card (NIC) *',
    recto: 'Front',
    verso: 'Back',
    prendrePhoto: 'Take photo',
    scannerPDF: 'Scan / PDF',
    inscriptionSecurisee: 'Secure registration',
    descInscription: 'Your NIC is required to guarantee the authenticity of your administrative requests.',
    cniRecto: 'NIC front/back required',
    codeUnique: 'Unique code for each request',
    qrCode: 'QR code sent by email',
    verificationSansConnexion: 'Verification possible without login',

    // Dashboard
    mesDemandes2: 'My requests',
    bonjour: 'Hello',
    gererDemandes: 'Manage your administrative document requests',
    nouvelleDemande2: 'New request',
    total: 'Total',
    enAttente: 'Pending',
    enTraitement: 'Processing',
    terminees: 'Completed',
    rechercherDemande: 'Search by type or reference...',
    filtresAvances: 'Advanced filters',
    aucuneDemande: 'No requests found',
    commencerPremiere: 'Start by making your first request',
    soumiseLe: 'Submitted on',
    motifRejet: 'Rejection reason:',
    rendezVousLe: 'Appointment on:',
    acteDisponibleLe: 'Document available from:',

    // Demande
    choisirActe: 'Choose your document',
    choisir: 'Choose',
    formulaire: 'Form',
    documents: 'Documents',
    continuer: 'Continue →',
    retour: 'Back',
    documentsAFournir: 'Documents to provide',
    scannerPhotographier: 'Scan or photograph each required document',
    soumettre: 'Submit',
    envoiEnCours: 'Sending...',
    demandesoumise: 'Request submitted!',
    demandeTransmise: 'Your request has been sent to the town hall.',
    votrecode: 'Your tracking code',
    conserverCode: 'Keep this code — it has been sent by email',
    voirMesDemandes: 'View my requests',
    champObligatoire: 'This field is required',
    remplirChamps: 'Please fill in all required fields before continuing.',
    confirmationSoumission: 'By submitting, you confirm that all information provided is accurate and authentic.',

    // Actes
    acteNaissance: 'Birth certificate',
    acteMariage: 'Marriage certificate',
    acteDeces: 'Death certificate',
    certResidence: 'Certificate of residence',
    certVie: 'Certificate of life',
    certCelibat: 'Certificate of celibacy',
    legalisation: 'Document legalization',
    attestDomicile: 'Proof of address',
    certNationalite: 'Certificate of nationality',
    autoParentale: 'Parental authorization',

    // Récupérer acte
    verifierActe: 'Check my document',
    descVerifier: 'Enter your tracking code received by email to check if your document is ready',
    codesuivi: 'Enter your tracking code',
    codeSuivi: 'Tracking code *',
    verifier: 'Check',
    codeFormat: '8-character code received by email when you submitted your request',
    ouTrouverCode: 'Where to find my tracking code?',

    // Aide
    centreAide: 'Help Center',
    descAide: 'Find answers to your questions about e-Mairie Douala services',
    rechercherQuestions: 'Search frequently asked questions...',

    // Statuts
    statutEnAttente: 'Pending',
    statutVerification: 'Processing',
    statutAccepte: 'Completed',
    statutRejete: 'Rejected',
    statutRdv: 'Appointment scheduled',
    statutDisponible: 'Available',
  }
};

export const LangueProvider = ({ children }) => {
  const [langue, setLangue] = useState('fr');
  const t = traductions[langue];
  const changerLangue = () => setLangue(langue === 'fr' ? 'en' : 'fr');

  return (
    <LangueContext.Provider value={{ langue, t, changerLangue }}>
      {children}
    </LangueContext.Provider>
  );
};

export const useLangue = () => useContext(LangueContext);
