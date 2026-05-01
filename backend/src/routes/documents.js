const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middlewares/authMiddleware');

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

// Upload documents pour une demande
router.post('/:demandeId', authMiddleware, upload.array('documents', 10), async (req, res) => {
  try {
    const { demandeId } = req.params;
    const { noms } = req.body;

    const docs = await Promise.all(req.files.map((file, i) =>
      prisma.document.create({
        data: {
          demandeId,
          nom: Array.isArray(noms) ? noms[i] : noms || file.originalname,
          url: `/uploads/${file.filename}`,
          type: file.mimetype,
        }
      })
    ));

    res.status(201).json({ message: 'Documents uploadés', documents: docs });
  } catch (error) {
    res.status(500).json({ message: 'Erreur upload', error: error.message });
  }
});

module.exports = router;
