const Payment = require("./payment.model");
const { initiatePayment } = require("./payment.service");

// In-memory debounce cache
const recentRequests = new Map();
const DEBOUNCE_TIME_MS = 3000;

const handlePayment = async (req, res) => {
  const {
    plan,
    description,
    deliveryTime,
    revisions,
    requirements,
    total_amount,
    cus_name,
    cus_email,
    cus_phone,
    cus_add1,
  } = req.body;

  const userKey = cus_email || req.ip;
  const now = Date.now();
  const lastRequestTime = recentRequests.get(userKey);

  if (lastRequestTime && now - lastRequestTime < DEBOUNCE_TIME_MS) {
    return res.status(429).json({
      message: "Please wait a moment before trying again.",
    });
  }

  recentRequests.set(userKey, now);
  setTimeout(() => recentRequests.delete(userKey), DEBOUNCE_TIME_MS);

  const tran_id = "TRAN_" + Date.now();

  try {
    // Save initial payment info (status: pending)
    await Payment.create({
      tranId: tran_id,
      plan,
      userEmail: cus_email,
      userName: cus_name,
      deliveryTime,
      revisions,
      requirements,
      status: "pending",
      amount: total_amount,
      user: {
        name: cus_name,
        email: cus_email,
        phone: cus_phone,
        address: cus_add1,
      },
    });

    const paymentData = {
      total_amount,
      currency: "USD",
      tran_id,
      success_url: "https://fastestcreators.com/payment-success",
      fail_url: "https://fastestcreators.com/payment-fail",
      cancel_url: "https://fastestcreators.com/payment-fail",
      ipn_url: "https://fastestcreators.com/payment-ipn", // optional
      shipping_method: "No Shipping",
      product_name: plan,
      product_category: "Digital Service",
      product_profile: "service",
      cus_name,
      cus_email,
      cus_add1,
      cus_city: "Dhaka",
      cus_postcode: "1207",
      cus_country: "Bangladesh",
      cus_phone,
      ship_name: cus_name,
      ship_add1: cus_add1,
      ship_city: "Dhaka",
      ship_postcode: "1207",
      ship_country: "Bangladesh",
    };

    const response = await initiatePayment(paymentData);

    if (response?.GatewayPageURL) {
      res.send({ url: response.GatewayPageURL });
    } else {
      res.status(500).json({
        message: "Payment initiation failed",
        debug: response,
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const handleSuccess = async (req, res) => {
  const { tran_id } = req.body;

  try {
    const updated = await Payment.findOneAndUpdate(
      { tranId: tran_id },
      { status: "completed", devStatus: "processing" },
      { new: true }
    );

    if (!updated) {
      return res.redirect("https://fastestcreators.com/payment-success?error=1");
    }

    res.redirect("https://fastestcreators.com/payment-success");
  } catch (error) {
    console.error("Success handler error:", error.message);
    res.redirect("https://fastestcreators.com/payment-success?error=1");
  }
};

const handleFail = async (req, res) => {
  const { tran_id } = req.body;

  try {
    await Payment.findOneAndUpdate(
      { tranId: tran_id },
      { status: "failed", DevStatus: "failed" }
    );
  } catch (error) {
    console.error("Fail handler error:", error.message);
  }

  res.redirect("https://fastestcreators.com/payment-fail");
};

module.exports = {
  handlePayment,
  handleSuccess,
  handleFail,
};
