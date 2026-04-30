const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { adminMiddleware } = require('../middlewares/authMiddleware');

const prisma = new PrismaClient();

// Toutes les demandes
router.get('/demandes', adminMiddleware, async (req, res) => {
  try {
    const { statut, typeActe } = req.query;
    const filtre = {};
    if (statut) filtre.statut = statut;
    if (typeActe) filtre.typeActe = typeActe;

    const demandes = await prisma.demande.findMany({
      where: filtre,
      include: { utilisateur: true, documents: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ demandes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Accepter une demande
router.patch('/demandes/:id/accepter', adminMiddleware, async (req, res) => {
  try {
    const { dateRendezVous, dateDisponibilite } = req.body;

    const demande = await prisma.demande.update({
      where: { id: req.params.id },
      data: {
        statut: 'ACCEPTE',
        dateRendezVous: dateRendezVous ? new Date(dateRendezVous) : null,
        dateDisponibilite: dateDisponibilite ? new Date(dateDisponibilite) : null
      }
    });

    res.json({ message: 'Demande acceptée', demande });
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
