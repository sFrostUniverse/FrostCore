const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');
const upload = require('../middleware/upload');

// 🌐 Group-specific doubt routes
router.get('/groups/:groupId/doubts', doubtController.getGroupDoubts);
router.post('/groups/:groupId/doubts', upload.single('image'), doubtController.askDoubt);

// 🗂️ General routes (optional fallback)
router.get('/', doubtController.getAllDoubts);
router.put('/:id/answer', doubtController.answerDoubt);

module.exports = router;
