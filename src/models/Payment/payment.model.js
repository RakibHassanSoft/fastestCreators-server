// payment/payment.model.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    tranId: { type: String, required: true, unique: true },
    devUrl: { type: String  , default:" "},
    delivery: { type: String , default:" "},
    plan: { type: String  ,required: true },
    userEmail: { type: String ,required: true  },
    userName: { type: String ,required: true  },
    deliveryTime:{type: String ,required: true },
    revisions:{type: String ,required: true },
    requirements:{type: String ,required: true },
    status:{type: String,required: true },
    devStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    amount: { type: String, required: true },
    user: {
      name: String,
      email: String,
      phone: String,
      address: String,
    }
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
