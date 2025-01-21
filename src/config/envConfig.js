require("dotenv").config();

const envConfig = {
  PORT: process.env.PORT || 5000,
  TWO_CHECKOUT_MERCHANT_CODE: process.env.TWO_CHECKOUT_MERCHANT_CODE,
  TWO_CHECKOUT_SECRET_KEY: process.env.TWO_CHECKOUT_SECRET_KEY,
  TWO_CHECKOUT_API_URL: "https://api.2checkout.com/rest",
};

module.exports = envConfig;
