const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');

router.get('/', getAllUsers); // e.g., GET /api/users

module.exports = router;
