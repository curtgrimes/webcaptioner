require('dotenv').config();
const admin = require('firebase-admin');

try {
  admin.auth()
} catch (e) {
  // This throws is the app isn't initialzed yet
  if (process.env.FIREBASE_NODE_SERVICE_ACCOUNT_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_NODE_SERVICE_ACCOUNT_KEY))
    });
  }
}

module.exports = () => {
  return admin;
};
