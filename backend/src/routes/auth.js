const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Inscription citoyen
router.post('/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, telephone } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: { nom, prenom, email, motDePasse: motDePasseHash, telephone }
    });

    const token = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Compte créé avec succès',
      token,
      utilisateur: { id: utilisateur.id, nom, prenom, email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Connexion citoyen
router.post('/connexion', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: utilisateur.id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: { id: utilisateur.id, nom: utilisateur.nom, prenom: utilisateur.prenom, email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Connexion admin
router.post('/admin/connexion', async (req, res) => {
  try {
    const { codeUnique, motDePasse } = req.body;

    const admin = await prisma.adminMairie.findUnique({
      where: { codeUnique }
    });

    if (!admin) {
      return res.status(401).json({ message: 'Code ou mot de passe incorrect' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, admin.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Code ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: admin.id, codeUnique: admin.codeUnique, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion admin réussie',
      token,
      admin: { id: admin.id, nom: admin.nom, prenom: admin.prenom, role: admin.role }
    });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
