// payment/payment.controller.js
const { initiatePayment } = require("./payment.service");

const handlePayment = async (req, res) => {
  const { total_amount, cus_name, cus_email, cus_phone, cus_add1 } = req.body;
  // console.log(req.body); 
  const data = {
    total_amount,
    currency: 'USD',
    tran_id: 'TRAN_' + new Date().getTime(),
    success_url: 'http://localhost:5000/payment/success',
    fail_url: 'http://localhost:5000/payment/fail',
    cancel_url: 'http://localhost:5000/payment/cancel',
    ipn_url: 'http://localhost:5000/payment/ipn',
    shipping_method: 'Courier',
    product_name: 'Test Product',
    product_category: 'Test Category',
    product_profile: 'digital_goods',
    cus_name,
    cus_email,
    cus_add1,
    cus_city: 'Dhaka',
    cus_postcode: '1207',
    cus_country: 'Bangladesh',
    cus_phone,
  
    // // ADD THESE SHIPPING FIELDS
    ship_name: cus_name,
    ship_add1: cus_add1,
    ship_city: 'Dhaka',
    ship_postcode: '1207',
    ship_country: 'Bangladesh',
  };
  

  try {
    const response = await initiatePayment(data);
    console.log("Payment Initiation Response:", response); // Debug output

    if (response.GatewayPageURL) {
      res.send({ url: response.GatewayPageURL });
    } else {
      res
        .status(500)
        .send({ message: "Payment initiation failed", debug: response });
    }
  } catch (error) {
    console.error("Error during payment:", error);
    res.status(500).send({ error: error.message });
  }
};

// For success/fail routes:
const handleSuccess = (req, res) => {
  console.log("Payment Success:", req.body);
  res.redirect("http://localhost:3000/payment-success");
};

const handleFail = (req, res) => {
  console.log("Payment Failed:", req.body);
  res.redirect("http://localhost:3000/payment-fail");
};

module.exports = {
  handlePayment,
  handleSuccess,
  handleFail,
};
