const Joi = require('joi');

// Validation pour la création d'une réclamation
const createComplaintSchema = Joi.object({
  userId: Joi.string().allow('', null),
  userEmail: Joi.string().email().required(),
  userName: Joi.string().required(),
  subject: Joi.string().required().min(5).max(100),
  description: Joi.string().required().min(10),
  bookId: Joi.string().allow('', null),
  bookTitle: Joi.string().allow('', null),
  category: Joi.string().valid('DELIVERY', 'PRODUCT_QUALITY', 'PAYMENT', 'CUSTOMER_SERVICE', 'OTHER').required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('MEDIUM'),
  attachments: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      url: Joi.string().required(),
      contentType: Joi.string().required()
    })
  ).default([])
});

// Validation pour la mise à jour d'une réclamation
const updateComplaintSchema = Joi.object({
  subject: Joi.string().min(5).max(100),
  description: Joi.string().min(10),
  category: Joi.string().valid('DELIVERY', 'PRODUCT_QUALITY', 'PAYMENT', 'CUSTOMER_SERVICE', 'OTHER'),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'),
  adminResponse: Joi.string().allow('', null),
  isResolved: Joi.boolean()
});

// Validation pour la mise à jour du statut
const updateStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED').required()
});

// Validation pour l'ajout d'une réponse admin
const addAdminResponseSchema = Joi.object({
  adminResponse: Joi.string().required().min(5)
});

// Middleware de validation
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }
    next();
  };
};

module.exports = {
  validateCreateComplaint: validateRequest(createComplaintSchema),
  validateUpdateComplaint: validateRequest(updateComplaintSchema),
  validateUpdateStatus: validateRequest(updateStatusSchema),
  validateAddAdminResponse: validateRequest(addAdminResponseSchema)
};
