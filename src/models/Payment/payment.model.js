// payment/payment.model.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  productId: String,
  userId : String,
  status: ['pending', 'processing', 'completed', 'failed'],
  reviceUrl: String,
  amount: Number,
 
},{
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
