const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Format non supporté'));
  }
});

// Inscription citoyen avec CNI
router.post('/inscription', upload.fields([
  { name: 'cniRecto', maxCount: 1 },
  { name: 'cniVerso', maxCount: 1 }
]), async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, telephone } = req.body;

    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    if (!req.files?.cniRecto || !req.files?.cniVerso) {
      return res.status(400).json({ message: 'Le recto et le verso de votre CNI sont obligatoires' });
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({ where: { email } });
    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom, prenom, email,
        motDePasse: motDePasseHash,
        telephone,
        cniRecto: `/uploads/${req.files.cniRecto[0].filename}`,
        cniVerso: `/uploads/${req.files.cniVerso[0].filename}`,
      }
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
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });

    if (!utilisateur || !await bcrypt.compare(motDePasse, utilisateur.motDePasse)) {
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
    const admin = await prisma.adminMairie.findUnique({ where: { codeUnique } });

    if (!admin || !await bcrypt.compare(motDePasse, admin.motDePasse)) {
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
