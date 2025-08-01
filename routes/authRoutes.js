const express = require('express');
const router = express.Router();
const { googleSignIn } = require('../controllers/authController');

router.post('/google-signin', googleSignIn);

module.exports = router;
