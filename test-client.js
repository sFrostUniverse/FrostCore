const { io } = require('socket.io-client');

// Replace this with your actual userId (from /signup or /login)
const userId = '<PASTE_YOUR_USER_ID_HERE>';

const socket = io('https://frostcore.onrender.com', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
});

socket.on('connect', () => {
  console.log('🟢 Connected to FrostCore socket server');
  socket.emit('register', userId);
});

socket.on('notification', (data) => {
  console.log('🔔 Notification received:', data);
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection error:', err.message);
});

socket.on('disconnect', () => {
  console.log('🔴 Disconnected from server');
});
