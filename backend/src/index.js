const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const demandesRoutes = require('./routes/demandes');
const adminRoutes = require('./routes/admin');
const documentsRoutes = require('./routes/documents');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/demandes', demandesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Portail Mairie Douala fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
