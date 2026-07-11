const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { verifierCNI } = require('../utils/verificationCNI');

const prisma = new PrismaClient();
const uploadsDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'));
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = new Set(['.jpeg', '.jpg', '.png', '.pdf']);
    const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
    const ok = allowedExtensions.has(path.extname(file.originalname).toLowerCase())
      && allowedMimeTypes.has(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Format non supporté'));
  }
});

// Inscription citoyen avec CNI
router.post('/inscription', upload.fields([
  { name: 'cniRecto', maxCount: 1 },
  { name: 'cniVerso', maxCount: 1 }
]), async (req, res) => {
  try {
    const { nom, prenom, motDePasse, telephone } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!nom || !prenom || !email || !motDePasse) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    if (motDePasse.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    if (!req.files?.cniRecto || !req.files?.cniVerso) {
      return res.status(400).json({ message: 'Le recto et le verso de votre CNI sont obligatoires' });
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({ where: { email } });
    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Vérification CNI par IA
    const cheminRecto = req.files.cniRecto[0].path;
    const cheminVerso = req.files.cniVerso[0].path;

    const verifRecto = await verifierCNI(cheminRecto);
    if (!verifRecto.valide) {
      return res.status(400).json({ message: `CNI Recto : ${verifRecto.message}` });
    }

    const verifVerso = await verifierCNI(cheminVerso);
    if (!verifVerso.valide) {
      return res.status(400).json({ message: `CNI Verso : ${verifVerso.message}` });
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
    const email = req.body.email?.trim().toLowerCase();
    const { motDePasse } = req.body;
    if (!email || !motDePasse) return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
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

// Mot de passe oublié
router.post('/mot-de-passe-oublie', async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Email obligatoire' });
    const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
    if (!utilisateur) {
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    }
    const token = jwt.sign(
      { id: utilisateur.id, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const lien = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reinitialiser-mot-de-passe?token=${token}`;
    const { envoyerEmailReinitialisaton } = require('../utils/emailService');
    await envoyerEmailReinitialisaton(email, utilisateur.prenom, lien);
    res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Réinitialiser mot de passe
router.post('/reinitialiser-mot-de-passe', async (req, res) => {
  try {
    const { token, nouveauMotDePasse } = req.body;
    if (!token || !nouveauMotDePasse || nouveauMotDePasse.length < 8) {
      return res.status(400).json({ message: 'Token et mot de passe de 8 caractères minimum obligatoires' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hash = await bcrypt.hash(nouveauMotDePasse, 10);
    await prisma.utilisateur.update({
      where: { id: decoded.id },
      data: { motDePasse: hash }
    });
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Token invalide ou expiré' });
  }
});

module.exports = router;
