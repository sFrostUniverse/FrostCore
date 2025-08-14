const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');
const upload = require('../config/cloudnaryUpload');
const { protect } = require('../middleware/authMiddleware');

// Get all doubts
router.get('/', protect, doubtController.getAllDoubts);

// Get doubts for a specific group (newest first)
router.get('/groups/:groupId/doubts', protect, doubtController.getGroupDoubts);

// Ask a doubt (with optional image)
router.post(
  '/groups/:groupId/doubts',
  protect,
  upload.single('image'),
  doubtController.askDoubt
);

// Get a single doubt by ID
router.get('/:id', protect, doubtController.getDoubtById);

// Answer a doubt (with optional image)
router.put('/:id/answer', protect, upload.single('image'), doubtController.answerDoubt);

// Delete a doubt
router.delete('/:id', protect, doubtController.deleteDoubt);

// Delete an individual answer
router.delete(
  '/answers/:answerId',
  protect,
  doubtController.deleteAnswer
);

module.exports = router;
