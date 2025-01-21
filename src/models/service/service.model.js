const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    serviceImage: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gigId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gigs', required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);


