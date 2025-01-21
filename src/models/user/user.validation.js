const Joi = require("joi");

// Register schema
const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50) // Adjusted to fit typical name lengths
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128) // Matches the password field's typical strength requirements
    .required(),
  phone: Joi.string().required(),
  role: Joi.string()
    .valid("admin", "user") // Matches the role enum in the Mongoose schema
    .default("user"),
  profile_image: Joi.string().uri().optional(), // Optional field for image URLs
  balance: Joi.string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional()
    .default("0"),
    otp:  Joi.string().optional(), // Store OTP
    otpExpiry:  Joi.string().optional(), // Store OTP expiration time
  // refreshToken: Joi.string().optional(),
  // resetToken: Joi.string().optional(),
  // tokenExpiry: Joi.string().optional(),
});

// Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
