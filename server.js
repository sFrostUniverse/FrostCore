require('dotenv').config();


const express = require('express');
const http = require('http'); // required for socket.io
const connectDB = require('./config/db');
const { Server } = require('socket.io'); // socket.io v4+
const groupRoutes = require('./routes/groupRoutes');
const app = express();
const server = http.createServer(app); // wrap app with HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for now (can restrict to FrostHub later)
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// DB Connection
connectDB();

// Middleware
app.use(express.json());

// Make io accessible to routes/controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.get('/', (req, res) => res.send('FrostCore API is running'));

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const noteRoutes = require('./routes/noteRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
app.use('/api/announcements', announcementRoutes);
app.use('/api', syllabusRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', timetableRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // Custom auth handshake (optional)
  socket.on('register', (userId) => {
    console.log(`🔐 Registering user ${userId} to socket room`);
    socket.join(userId); // Join room by userId
  });

  socket.on('join-group', (groupId) => {
    console.log(`👥 Socket ${socket.id} joined group ${groupId}`);
    socket.join(groupId);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
