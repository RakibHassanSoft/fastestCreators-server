const Joi = require('joi');

const validateSchemaWithJoi = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next(); // Proceed to the next middleware if validation passes
    } catch (err) {
      console.log(err)
      res.status(400).json({err});
    }
  };
};

module.exports = validateSchemaWithJoi;
