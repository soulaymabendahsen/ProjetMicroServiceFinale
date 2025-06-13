const mongoose = require('mongoose');

// Définition du schéma pour les réclamations
const complaintSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // Optionnel si l'utilisateur n'est pas connecté
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir une adresse email valide']
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  bookId: {
    type: String,
    required: false // Optionnel si la réclamation ne concerne pas un livre spécifique
  },
  bookTitle: {
    type: String,
    required: false // Optionnel si la réclamation ne concerne pas un livre spécifique
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING'
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  },
  category: {
    type: String,
    enum: ['DELIVERY', 'PRODUCT_QUALITY', 'PAYMENT', 'CUSTOMER_SERVICE', 'OTHER'],
    required: true
  },
  attachments: [{
    name: String,
    url: String,
    contentType: String
  }],
  adminResponse: {
    type: String,
    default: ''
  },
  adminResponseDate: {
    type: Date
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedDate: {
    type: Date
  }
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

// Création d'index pour améliorer les performances des requêtes
complaintSchema.index({ userEmail: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ createdAt: -1 });

// Méthodes statiques
complaintSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

complaintSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

complaintSchema.statics.findByPriority = function(priority) {
  return this.find({ priority });
};

complaintSchema.statics.getStatistics = async function() {
  return {
    total: await this.countDocuments(),
    pending: await this.countDocuments({ status: 'PENDING' }),
    inProgress: await this.countDocuments({ status: 'IN_PROGRESS' }),
    resolved: await this.countDocuments({ status: 'RESOLVED' }),
    rejected: await this.countDocuments({ status: 'REJECTED' }),
    byCategory: await this.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]),
    byPriority: await this.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ])
  };
};

// Méthodes d'instance
complaintSchema.methods.markAsResolved = function() {
  this.status = 'RESOLVED';
  this.isResolved = true;
  this.resolvedDate = new Date();
  return this.save();
};

complaintSchema.methods.updateStatus = function(status) {
  this.status = status;
  if (status === 'RESOLVED') {
    this.isResolved = true;
    this.resolvedDate = new Date();
  }
  return this.save();
};

complaintSchema.methods.addAdminResponse = function(response) {
  this.adminResponse = response;
  this.adminResponseDate = new Date();
  return this.save();
};

// Création et export du modèle
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
