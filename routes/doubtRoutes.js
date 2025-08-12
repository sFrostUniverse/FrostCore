const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');
const upload = require('../config/cloudnaryUpload');
const { protect } = require('../middleware/authMiddleware');

// Get all doubts
router.get('/', protect, doubtController.getAllDoubts);

// Get doubts for a specific group
router.get('/group/:groupId', protect, doubtController.getGroupDoubts);

// Ask a doubt (with optional image)
router.post('/group/:groupId', protect, upload.single('image'), doubtController.askDoubt);

// Get a single doubt by ID
router.get('/:id', protect, doubtController.getDoubtById);

// Answer a doubt (with optional image)
router.put('/:id/answer', protect, upload.single('image'), doubtController.answerDoubt);

module.exports = router;
