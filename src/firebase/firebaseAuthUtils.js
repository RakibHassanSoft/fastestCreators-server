const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('./service-account-key.json'); // Path to your service account key
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


const updateUserPassword = async (email, newPassword) => {
    try {
      const user = await admin.auth().getUserByEmail(email);
      const res = await admin.auth().updateUser(user.uid, { password: newPassword });
  
      // Here, you can return some information to indicate success
      if (res.uid === user.uid) {
        return { message: 'Password updated successfully in Firebase',success:true };
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
