const express = require('express');
const router = express.Router();
const { googleSignIn, loginUser, signupUser } = require('../controllers/authController');

router.post('/google-signin', googleSignIn);
router.post('/login', loginUser);
router.post('/signup', signupUser);

module.exports = router;
