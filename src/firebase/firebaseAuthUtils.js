const admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix multiline key
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // const serviceAccount = require('./service-account-key.json'); // Ensure this is the correct path
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const updateUserPassword = async (email, newPassword) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    // console.log("Firebase user:", user);
    const res = await admin.auth().updateUser(user.uid, { password: newPassword });
    // console.log("Firebase update response:", res);

    if (res.uid === user.uid) {
      return { message: 'Password updated successfully in Firebase', success: true };
    } else {
      throw new Error('User UID mismatch');
    }
  } catch (error) {
    console.error('Error updating password:', error.message);
    throw new Error('Failed to update user password');
  }
};

module.exports = {
  updateUserPassword,
};
