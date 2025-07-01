const Complaint = require('../models/complaint.model');
const mongoose = require('mongoose');

// Créer une nouvelle réclamation
exports.createComplaint = async (req, res) => {
  try {
    console.log('Données reçues:', req.body);

    // Vérification des champs obligatoires
    const { userName, userEmail, subject, description, category } = req.body;

    if (!userName || !userEmail || !subject || !description || !category) {
      return res.status(400).json({
        message: 'Données invalides',
        details: 'Tous les champs obligatoires doivent être fournis (userName, userEmail, subject, description, category)'
      });
    }

    const complaint = new Complaint(req.body);
    const savedComplaint = await complaint.save();
    console.log('Réclamation créée avec succès:', savedComplaint);
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Erreur lors de la création de la réclamation:', error);

    // Gérer les erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Erreur de validation',
        details: validationErrors
      });
    }

    res.status(500).json({
      message: 'Erreur lors de la création de la réclamation',
      error: error.message
    });
  }
};

// Récupérer toutes les réclamations avec pagination et filtres
exports.getAllComplaints = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      userEmail,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construction du filtre
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (userEmail) filter.userEmail = userEmail;

    // Construction du tri
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Exécution de la requête avec pagination
    const complaints = await Complaint.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Comptage total pour la pagination
    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réclamations', error: error.message });
  }
};

// Récupérer une réclamation par son ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la réclamation', error: error.message });
  }
};

// Mettre à jour une réclamation
exports.updateComplaint = async (req, res) => {
  try {
    console.log('Données reçues pour la mise à jour:', req.body);
    console.log('ID de la réclamation à mettre à jour:', req.params.id);

    // Vérifier si l'ID est valide
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de réclamation non valide' });
    }

    // Vérifier si la réclamation existe avant de la mettre à jour
    const existingComplaint = await Complaint.findById(req.params.id);
    if (!existingComplaint) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    // Mettre à jour la réclamation
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('Réclamation mise à jour avec succès:', complaint);
    res.status(200).json(complaint);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);

    // Gérer les erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Erreur de validation',
        details: validationErrors
      });
    }

    // Gérer les erreurs de cast (ID invalide)
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID de réclamation non valide',
        details: error.message
      });
    }

    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la réclamation',
      error: error.message
    });
  }
};

// Supprimer une réclamation
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    res.status(200).json({ message: 'Réclamation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la réclamation', error: error.message });
  }
};

// Mettre à jour le statut d'une réclamation
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    const updatedComplaint = await complaint.updateStatus(status);
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};

// Ajouter une réponse admin
exports.addAdminResponse = async (req, res) => {
  try {
    const { adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    const updatedComplaint = await complaint.addAdminResponse(adminResponse);
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la réponse admin', error: error.message });
  }
};

// Marquer une réclamation comme résolue
exports.markAsResolved = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    const resolvedComplaint = await complaint.markAsResolved();
    res.status(200).json(resolvedComplaint);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la résolution de la réclamation', error: error.message });
  }
};

// Obtenir des statistiques sur les réclamations
exports.getStatistics = async (req, res) => {
  try {
    const statistics = await Complaint.getStatistics();
    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error: error.message });
  }
};

// Récupérer les réclamations d'un utilisateur par email
exports.getUserComplaints = async (req, res) => {
  try {
    const { email } = req.params;
    const complaints = await Complaint.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réclamations de l\'utilisateur', error: error.message });
  }
};
