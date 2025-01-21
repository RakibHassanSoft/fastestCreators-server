const Joi = require('joi');

// Joi schema for validating the service data
const serviceSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title can be a maximum of 255 characters long',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    'string.base': 'Description must be a string',
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description can be a maximum of 1000 characters long',
    'any.required': 'Description is required',
  }),
  serviceImage: Joi.string().required().messages({
    'string.base': 'Description must be a string',
    'any.required': 'Description is required',
  }),

});
const serviceUdateSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional().messages({
    'string.base': 'Title must be a string',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title can be a maximum of 255 characters long',
    'any.required': 'Title is required',
  }),
  description: Joi.string().min(10).max(1000).required().optional().messages({
    'string.base': 'Description must be a string',
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description can be a maximum of 1000 characters long',
    'any.required': 'Description is required',
  }),
  serviceImage: Joi.string().required().optional().messages({
    'string.base': 'Description must be a string',
    'any.required': 'Description is required',
  }),

});

// Function to validate the service data
const validateService = (data) => {
  return serviceSchema.validate(data, { abortEarly: false });
};
const validateUpdatedService = (data) => {
  return serviceUdateSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateService,
  validateUpdatedService
};
