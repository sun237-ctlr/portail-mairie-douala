const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { genererCodeUnique, genererQRCode } = require('../utils/codeUnique');
const { envoyerEmailCodeUnique } = require('../utils/emailService');

const prisma = new PrismaClient();

// Créer une demande
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { typeActe, donnees } = req.body;
    const utilisateurId = req.utilisateur.id;

    const actesUniques = ['ACTE_NAISSANCE', 'ACTE_MARIAGE', 'ACTE_DECES', 'CERTIFICAT_NATIONALITE'];

    if (actesUniques.includes(typeActe)) {
      const demandeExistante = await prisma.demande.findFirst({
        where: {
          utilisateurId,
          typeActe,
          statut: { in: ['EN_ATTENTE', 'ACCEPTE', 'ACTE_DISPONIBLE'] }
        }
      });
      if (demandeExistante) {
        return res.status(400).json({ message: 'Vous avez déjà une demande en cours pour cet acte' });
      }
    }

    const codeUnique = genererCodeUnique();

    const demande = await prisma.demande.create({
      data: { utilisateurId, typeActe, donnees, statut: 'EN_ATTENTE', codeUnique },
      include: { utilisateur: true }
    });

    try {
      const { qrBase64 } = await genererQRCode(codeUnique);
      await envoyerEmailCodeUnique(
        demande.utilisateur.email,
        demande.utilisateur.prenom,
        typeActe,
        codeUnique,
        qrBase64
      );
    } catch (emailErr) {
      console.log('Email non envoyé:', emailErr.message);
    }

    res.status(201).json({ message: 'Demande soumise avec succès', demande });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Mes demandes
router.get('/mes-demandes', authMiddleware, async (req, res) => {
  try {
    const demandes = await prisma.demande.findMany({
      where: { utilisateurId: req.utilisateur.id },
      include: { documents: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ demandes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Vérifier par code unique, codeRecuperation, ou code rendez-vous — PUBLIC (sans authentification)
router.get('/verifier/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const expectedType = req.query.typeActe;

    // Rechercher par codeUnique, codeRecuperation sur demande, ou codeRecuperation du rendez-vous
    const demande = await prisma.demande.findFirst({
      where: {
        OR: [
          { codeUnique: code },
          { codeRecuperation: code },
          { rendezVous: { codeRecuperation: code } }
        ]
      },
      include: {
        utilisateur: { select: { prenom: true, nom: true } },
        rendezVous: true
      }
    });

    if (!demande) {
      return res.status(404).json({ message: 'Aucune demande trouvée avec ce code. Vérifiez que vous avez bien copié le code reçu par email.' });
    }

    // Indiquer si le code correspond au type d'acte (si fourni)
    const matchesType = expectedType ? (demande.typeActe === expectedType) : true;

    // Indiquer si l'acte est disponible
    const acteDisponible = demande.statut === 'ACTE_DISPONIBLE' || (demande.rendezVous && demande.statut === 'ACCEPTE');

    // Fournir une date de disponibilité si un rendez-vous est présent
    const dateDisponibilite = demande.rendezVous ? demande.rendezVous.dateRendezVous : null;

    res.json({
      demande: {
        id: demande.id,
        codeUnique: demande.codeUnique,
        typeActe: demande.typeActe,
        statut: demande.statut,
        etapeConfirmation: demande.etapeConfirmation,
        donnees: demande.donnees,
        raisonRejet: demande.raisonRejet,
        codeRecuperation: demande.codeRecuperation,
        dateConfirmation: demande.dateConfirmation,
        createdAt: demande.createdAt,
        updatedAt: demande.updatedAt,
        utilisateur: demande.utilisateur,
        rendezVous: demande.rendezVous,
        dateDisponibilite,
        acteDisponible,
        matchesType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Détail d'une demande par ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const demande = await prisma.demande.findUnique({
      where: { id: req.params.id },
      include: { documents: true, utilisateur: true, rendezVous: true }
    });
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });
    res.json({ demande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Confirmer les informations (après avoir reçu l'email)
router.post('/confirmer/:codeUnique', async (req, res) => {
  try {
    const demande = await prisma.demande.findUnique({
      where: { codeUnique: req.params.codeUnique.toUpperCase() },
      include: { utilisateur: true }
    });

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    if (demande.etapeConfirmation !== 'EMAIL_ENVOYE') {
      return res.status(400).json({ message: 'Cette demande n\'est pas en attente de confirmation' });
    }

    // Marquer comme confirmée
    const demandeUpdated = await prisma.demande.update({
      where: { id: demande.id },
      data: {
        etapeConfirmation: 'CONFIRME',
        dateConfirmation: new Date()
      }
    });

    res.json({ 
      message: 'Informations confirmées avec succès. Un rendez-vous vous sera attribué prochainement.', 
      demande: demandeUpdated 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Demander des modifications (après avoir reçu l'email)
router.post('/modifier/:codeUnique', async (req, res) => {
  try {
    const demande = await prisma.demande.findUnique({
      where: { codeUnique: req.params.codeUnique.toUpperCase() },
      include: { utilisateur: true }
    });

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    if (demande.etapeConfirmation !== 'EMAIL_ENVOYE') {
      return res.status(400).json({ message: 'Cette demande n\'est pas en attente de confirmation' });
    }

    // Marquer comme demandant des modifications
    const demandeUpdated = await prisma.demande.update({
      where: { id: demande.id },
      data: {
        etapeConfirmation: 'MODIFICATIONS_DEMANDEES'
      }
    });

    res.json({ 
      message: 'Votre demande de modification a été enregistrée. Veuillez contacter la mairie pour apporter les modifications.', 
      demande: demandeUpdated 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
