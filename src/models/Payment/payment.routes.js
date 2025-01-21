const express = require("express");
const { processPayment } = require("./payment.controller");


const paymentRouter = express.Router();

// POST route to process payment
router.post("/api/payment", processPayment);

module.exports = paymentRouter;
