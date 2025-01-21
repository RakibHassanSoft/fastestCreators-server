const axios = require("axios");
const envConfig = require("../../config/envConfig");
const Payment = require("./payment.model");

const createPaymentToken = async (paymentData) => {
    const { userId, productId, amount, currency, billingDetails } = paymentData;
  
    // Create a new payment record in the database
    const paymentRecord = new Payment({
      userId,
      productId,
      amount,
      currency,
      status: "Pending",
    });
  
    await paymentRecord.save();
  
    try {
      // Call 2Checkout API to generate payment token
      const response = await axios.post(
        `${envConfig.TWO_CHECKOUT_API_URL}/auth/tokens`,
        {
          sellerId: envConfig.TWO_CHECKOUT_MERCHANT_CODE,
          privateKey: envConfig.TWO_CHECKOUT_SECRET_KEY,
          amount,
          currency,
          billingAddr: billingDetails,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      // Update the payment record with the token and success status
      paymentRecord.paymentToken = response.data.token;
      paymentRecord.status = "Success";
      await paymentRecord.save();
  
      return paymentRecord;
    } catch (error) {
      // Handle 2Checkout or network errors
      paymentRecord.status = "Failed";
      paymentRecord.errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      await paymentRecord.save();
  
      // Throw appropriate error for the controller to handle
      if (error.response) {
        throw new Error(
          `2Checkout Error: ${error.response.data.message || "Unknown error"}`
        );
      } else if (error.request) {
        throw new Error("Network error, please try again later.");
      } else {
        throw new Error(error.message || "An unexpected error occurred.");
      }
    }
  };
  
  module.exports = { createPaymentToken };