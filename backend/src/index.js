const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const demandesRoutes = require('./routes/demandes');
const adminRoutes = require('./routes/admin');
const documentsRoutes = require('./routes/documents');
const iaRoutes = require('./routes/ia');

const app = express();
const uploadsDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../uploads'));
fs.mkdirSync(uploadsDir, { recursive: true });

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origine non autorisée par CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir, { index: false, dotfiles: 'deny' }));

app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/ia', iaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Portail Mairie Douala fonctionne !' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((error, req, res, next) => {
  if (error) {
    const status = error.name === 'MulterError' ? 400 : 500;
    return res.status(status).json({ message: error.message || 'Erreur serveur' });
  }
  return next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
