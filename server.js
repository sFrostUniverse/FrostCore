require('dotenv').config();

const express = require('express');
const app = express();

const logger = require('./utils/logger');

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
});


const http = require('http'); // required for socket.io
const connectDB = require('./config/db');
const { Server } = require('socket.io'); // socket.io v4+
const groupRoutes = require('./routes/groupRoutes');
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
app.get('/', (req, res) => {
  logger.info('Root route accessed');
  res.send('FrostCore API is running');
});

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const noteRoutes = require('./routes/noteRoutes');
const syllabusRoutes = require('./routes/syllabusRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/uploads', express.static('uploads')); // static serving for uploaded files
app.use('/api/upload', uploadRoutes); // image upload route
app.use('/api/doubts', doubtRoutes); // ⬅️ Clean mounting for doubt-related routes

app.use('/api/announcements', announcementRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api', timetableRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Handle socket connections
io.on('connection', (socket) => {
  logger.info(`🟢 New client connected: ${socket.id}`);

  socket.on('register', (userId) => {
    logger.info(`🔐 Registering user ${userId} to socket room`);
    socket.join(userId);
  });

  socket.on('join-group', (groupId) => {
    logger.info(`👥 Socket ${socket.id} joined group ${groupId}`);
    socket.join(groupId);
  });

  socket.on('disconnect', () => {
    logger.info(`🔴 Client disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
