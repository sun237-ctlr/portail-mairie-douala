const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middlewares/authMiddleware');

const prisma = new PrismaClient();

// Créer une demande
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { typeActe, donnees } = req.body;
    const utilisateurId = req.utilisateur.id;

    const actesUniques = [
      'ACTE_NAISSANCE', 'ACTE_MARIAGE', 'ACTE_DECES',
      'CERTIFICAT_NATIONALITE'
    ];

    if (actesUniques.includes(typeActe)) {
      const demandeExistante = await prisma.demande.findFirst({
        where: {
          utilisateurId,
          typeActe,
          statut: { in: ['EN_ATTENTE', 'ACCEPTE', 'ACTE_DISPONIBLE'] }
        }
      });

      if (demandeExistante) {
        return res.status(400).json({
          message: 'Vous avez déjà une demande en cours ou acceptée pour cet acte'
        });
      }
    }

    const demande = await prisma.demande.create({
      data: { utilisateurId, typeActe, donnees, statut: 'EN_ATTENTE' }
    });

    res.status(201).json({
      message: 'Demande soumise avec succès',
      demande
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Mes demandes (citoyen)
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

// Détail d'une demande
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const demande = await prisma.demande.findUnique({
      where: { id: req.params.id },
      include: { documents: true, utilisateur: true }
    });

    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    res.json({ demande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
