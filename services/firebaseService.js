const admin = require('firebase-admin');

const raw = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// 🔧 Replace escaped newlines with real newlines
raw.private_key = raw.private_key.replace(/\\n/g, '\n');

// ✅ Initialize admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(raw),
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
