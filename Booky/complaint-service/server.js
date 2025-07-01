require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const eurekaClient = require('./config/eureka-client');

// Routes
const complaintRoutes = require('./routes/complaint.routes');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Autorise toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// Middleware pour afficher les requêtes entrantes (débogage)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.method !== 'GET') {
    console.log('Body:', req.body);
  }
  next();
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
app.use('/api/complaints', complaintRoutes);

// Route de base pour vérifier que le service fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur le service de gestion des réclamations' });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);

  // Enregistrement auprès d'Eureka
  eurekaClient.start((error) => {
    if (error) {
      console.error('Erreur lors de l\'enregistrement auprès d\'Eureka:', error);
    } else {
      console.log('Service enregistré auprès d\'Eureka');
    }
  });
});

// Gestion de l'arrêt propre du serveur
process.on('SIGINT', () => {
  eurekaClient.stop();
  mongoose.connection.close(() => {
    console.log('Connexion MongoDB fermée');
    process.exit(0);
  });
});

module.exports = app; // Pour les tests
