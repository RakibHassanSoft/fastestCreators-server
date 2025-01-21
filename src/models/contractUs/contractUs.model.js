const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contractNumber: { type: String, required: true },
    message: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
