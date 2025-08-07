const express = require('express');
const router = express.Router();
const doubtController = require('../controllers/doubtController');

// 🌐 Group-specific doubt routes
router.get('/:groupId/doubts', doubtController.getGroupDoubts);
router.post('/:groupId/doubts', doubtController.askDoubt);


// 🗂️ General routes (optional fallback)
router.post('/', doubtController.askDoubt);
router.get('/', doubtController.getAllDoubts);
router.put('/:id/answer', doubtController.answerDoubt);

module.exports = router;
