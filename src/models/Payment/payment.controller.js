
const userModel = require("../user/user.model");
const logger = require("../utils/logger");
const { createPaymentToken } = require("./payment.service");


const processPayment = async (req, res) => {
  const { userId, productId, amount, currency, billingDetails } = req.body;

  try {
    // Validate required fields
    if (!userId || !productId || !amount || !currency || !billingDetails) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Check if user balance is sufficient (example logic, assumes balance is part of the User schema)
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (parseFloat(user.balance) < parseFloat(amount)) {
      return res.status(400).json({ success: false, message: "Insufficient balance." });
    }

    // Process payment through service
    const paymentRecord = await createPaymentToken({
      userId,
      productId,
      amount,
      currency,
      billingDetails,
    });

    logger.log(`Payment processed successfully: ${paymentRecord._id}`);
    return res.status(200).json({ success: true, payment: paymentRecord });
  } catch (error) {
    logger.error(`Payment processing failed: ${error.message}`);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { processPayment };
