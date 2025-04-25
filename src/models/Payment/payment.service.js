// payment/payment.service.js
const SSLCommerzPayment = require('sslcommerz-lts');

const store_id = process.env.store_id ;
const store_passwd = process.env.secret_key ;
const is_live = process.env.is_live === 'true';  // true for production

const initiatePayment = (data) => {
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  return sslcz.init(data);
};

module.exports = { initiatePayment };
