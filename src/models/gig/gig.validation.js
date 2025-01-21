const Joi = require("joi");

// Feedback Validation Schema
const feedbackSchema = Joi.object({
  userId: Joi.string().required(),
  imageUrl: Joi.string().uri().required(),
  comment: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});

// Package Validation Schema
const packageSchema = Joi.object({
  title: Joi.string().required(),
  features: Joi.array().items(Joi.string()).min(1).required(),
  visibility: Joi.array().items(Joi.boolean()).length(3).required(),
});

// Highlight Validation Schema
const highlightSchema = Joi.object({
  feature: Joi.string().required(),
  detail: Joi.string().required(),
});

// Pricing Validation Schema
const pricingSchema = Joi.object({
  basic: Joi.object({
    price: Joi.string().required(),
    description: Joi.string().required(),
    revisions: Joi.string().required(),
    deliveryTime: Joi.string().required(),
  }).required(),
  standard: Joi.object({
    price: Joi.string().required(),
    description: Joi.string().required(),
    revisions: Joi.string().required(),
    deliveryTime: Joi.string().required(),
  }).required(),
  premium: Joi.object({
    price: Joi.string().required(),
    description: Joi.string().required(),
    revisions: Joi.string().required(),
    deliveryTime: Joi.string().required(),
  }).required(),
});

// Why Choose Us Validation Schema
const whyChooseUsSchema = Joi.object({
  title: Joi.string().required(),
  points: Joi.array().items(Joi.string()).min(1).required(),
  details: Joi.string().required(),
});

// Frequently Asked Questions Validation Schema
const frequentlySchema = Joi.array().items(
  Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  })
);

// Gig Validation Schema
const gigSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().optional(), // Slug is auto-generated
  owner: Joi.object({
    image: Joi.string().uri().required(),
    name: Joi.string().required(),
    bio: Joi.string().required(),
  }).required(),
  serviceId: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  aboutDetails: Joi.string().required(),
  offerings: Joi.array().items(Joi.string()).min(1).required(),
  highlights: Joi.array().items(highlightSchema).min(1).required(),
  whyChooseUs: whyChooseUsSchema.required(),
  packages: Joi.array().items(packageSchema).min(1).required(),
  pricing: pricingSchema.required(),
  feedbacks: Joi.array().items(Joi.string().optional()), // References
  frequently: frequentlySchema.required(),
});

module.exports = {
  feedbackSchema,
  gigSchema,
};
