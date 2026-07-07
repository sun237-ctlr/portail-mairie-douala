const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { adminMiddleware } = require('../middlewares/authMiddleware');
const { envoyerEmailConfirmationDonnees, envoyerEmailRendezVous, envoyerEmailRejet } = require('../utils/emailService');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Générer un code unique (pour code de récupération)
const genererCodeUnique = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Toutes les demandes
router.get('/demandes', adminMiddleware, async (req, res) => {
  try {
    const { statut, typeActe } = req.query;
    const filtre = {};
    if (statut) filtre.statut = statut;
    if (typeActe) filtre.typeActe = typeActe;

    const demandes = await prisma.demande.findMany({
      where: filtre,
      include: { utilisateur: true, documents: true, rendezVous: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ demandes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Accepter une demande - Envoyer email de confirmation
router.patch('/demandes/:id/accepter', adminMiddleware, async (req, res) => {
  try {
    const demande = await prisma.demande.findUnique({
      where: { id: req.params.id },
      include: { utilisateur: true }
    });

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    // Marquer comme acceptée et envoyer email de confirmation
    const demandeUpdated = await prisma.demande.update({
      where: { id: req.params.id },
      data: {
        statut: 'ACCEPTE',
        etapeConfirmation: 'EMAIL_ENVOYE'
      }
    });

    // Créer les liens de confirmation/modification (à adapter selon votre frontend)
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const lienConfirmer = `${baseUrl}/confirmer-demande/${demande.codeUnique}?action=confirmer`;
    const lienModifier = `${baseUrl}/confirmer-demande/${demande.codeUnique}?action=modifier`;

    // Envoyer l'email de confirmation
    await envoyerEmailConfirmationDonnees(
      demande.utilisateur.email,
      `${demande.utilisateur.prenom} ${demande.utilisateur.nom}`,
      demande.typeActe,
      demande.donnees,
      lienConfirmer,
      lienModifier
    );

    res.json({ message: 'Demande acceptée - Email de confirmation envoyé', demande: demandeUpdated });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Confirmer les informations et fixer le rendez-vous
router.patch('/demandes/:id/confirmer', adminMiddleware, async (req, res) => {
  try {
    const { dateRendezVous } = req.body;

    if (!dateRendezVous) {
      return res.status(400).json({ message: 'La date du rendez-vous est obligatoire' });
    }

    const demande = await prisma.demande.findUnique({
      where: { id: req.params.id },
      include: { utilisateur: true }
    });

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    // Générer code de récupération
    const codeRecuperation = genererCodeUnique();

    // Créer le rendez-vous et mettre à jour la demande
    const rendezVous = await prisma.rendezVous.create({
      data: {
        demandeId: demande.id,
        dateRendezVous: new Date(dateRendezVous),
        codeRecuperation: codeRecuperation,
        statut: 'FIXE'
      }
    });

    const demandeUpdated = await prisma.demande.update({
      where: { id: req.params.id },
      data: {
        etapeConfirmation: 'RENDEZ_VOUS_FIXE',
        codeRecuperation: codeRecuperation,
        dateConfirmation: new Date()
      }
    });

    // Envoyer l'email avec le rendez-vous et code de récupération
    await envoyerEmailRendezVous(
      demande.utilisateur.email,
      `${demande.utilisateur.prenom} ${demande.utilisateur.nom}`,
      demande.typeActe,
      dateRendezVous,
      codeRecuperation
    );

    res.json({ message: 'Rendez-vous fixé - Email envoyé', demande: demandeUpdated, rendezVous });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Rejeter une demande
router.patch('/demandes/:id/rejeter', adminMiddleware, async (req, res) => {
  try {
    const { raisonRejet } = req.body;

    if (!raisonRejet) {
      return res.status(400).json({ message: 'La raison du rejet est obligatoire' });
    }

    const demande = await prisma.demande.update({
      where: { id: req.params.id },
      data: { statut: 'REJETE', raisonRejet }
    });

    res.json({ message: 'Demande rejetée', demande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
