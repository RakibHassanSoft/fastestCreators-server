const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig", // Reference to Product/Project model
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Cancelled"],
      default: "Pending",
    },
    paymentToken: {
      type: String, // Token from the payment gateway (e.g., 2Checkout)
      required: false,
    },
    errorMessage: {
      type: String, // Store errors for failed transactions
      required: false,
    },
  },
  { timestamps: true } // Automatically manage `createdAt` and `updatedAt`
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
