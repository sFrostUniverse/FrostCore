const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');

// 🌐 Group-specific doubt routes
router.post('/groups/:groupId/doubts', doubtController.askDoubt);
router.get('/groups/:groupId/doubts', doubtController.getGroupDoubts);

// 🗂️ General routes (optional fallback)
router.post('/', doubtController.askDoubt);
router.get('/', doubtController.getAllDoubts);
router.put('/:id/answer', doubtController.answerDoubt);

module.exports = router;
