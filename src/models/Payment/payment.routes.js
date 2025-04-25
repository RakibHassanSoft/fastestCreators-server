// payment/payment.routes.js
const express = require('express');
const router = express.Router();
const {
  handlePayment,
  handleSuccess,
  handleFail,
} = require('./payment.controller');

router.post('/initiate', handlePayment);
router.post('/success', handleSuccess);
router.post('/fail', handleFail);

module.exports = router;
