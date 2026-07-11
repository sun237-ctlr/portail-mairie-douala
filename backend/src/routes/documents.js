const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { authMiddleware } = require("../middlewares/authMiddleware");

const prisma = new PrismaClient();
const uploadsDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"));
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = new Set(['.jpeg', '.jpg', '.png', '.pdf']);
    const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
    const ok = allowedExtensions.has(path.extname(file.originalname).toLowerCase())
      && allowedMimeTypes.has(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Format non supporté"));
  },
});

// Upload documents pour une demande
router.post(
  "/:demandeId",
  authMiddleware,
  upload.array("documents", 10),
  async (req, res) => {
    try {
      const { demandeId } = req.params;
      const { noms } = req.body;

      console.log("Upload attempt:", {
        demandeId,
        filesCount: req.files?.length,
        noms,
        userId: req.utilisateur.id,
      });

      // Vérifier que la demande existe et appartient à l'utilisateur
      const demande = await prisma.demande.findFirst({
        where: { id: demandeId, utilisateurId: req.utilisateur.id },
      });
      if (!demande) {
        return res.status(404).json({ message: "Demande non trouvée" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Aucun fichier uploadé" });
      }

      const docs = await Promise.all(
        req.files.map((file, i) =>
          prisma.document.create({
            data: {
              demandeId,
              nom: Array.isArray(noms) ? noms[i] : noms || file.originalname,
              url: `/uploads/${file.filename}`,
              type: file.mimetype,
            },
          }),
        ),
      );

      res.status(201).json({ message: "Documents uploadés", documents: docs });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Erreur upload", error: error.message });
    }
  },
);

module.exports = router;
