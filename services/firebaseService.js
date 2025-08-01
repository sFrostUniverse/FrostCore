const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAccount.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const sendPushNotification = async (fcmToken, title, body) => {
  const message = {
    notification: { title, body },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent:', response);
  } catch (error) {
    console.error('❌ Failed to send notification:', error.message);
  }
};

module.exports = { sendPushNotification };
