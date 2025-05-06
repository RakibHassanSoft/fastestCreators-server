require('dotenv').config();

// Structure the data into nested objects
const config = {
  environment: {
    nodeEnv: process.env.NODE_ENV,
    appEnv: process.env.APP_ENV,
  },
  server: {
    port: process.env.PORT,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  otp: {
    expiration: process.env.OTP_EXPIRATION,
  },
  firebase: {
    type: process.env.GOOGLE_TYPE,
    projectId: process.env.GOOGLE_PROJECT_ID,
    privateKeyId: process.env.GOOGLE_PRIVATE_KEY_ID,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    authUri: process.env.GOOGLE_AUTH_URI,
    tokenUri: process.env.GOOGLE_TOKEN_URI,
    authProviderX509CertUrl: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universeDomain: process.env.GOOGLE_UNIVERSE_DOMAIN,
  },
  ssl: {
    storeId: process.env.STORE_ID,
    secretKey: process.env.SECRET_KEY,
    isLive: process.env.IS_LIVE === 'true', // Convert string to boolean
  },
};

// Example of using the organized config object
console.log(config); // Prints the entire configuration object

// Accessing a specific value
console.log(`Database URL: ${config.database.url}`);
console.log(`JWT Secret: ${config.jwt.secret}`);
console.log(`Email Service: ${config.email.service}`);
