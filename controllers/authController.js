const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Google Sign-In
exports.googleSignIn = async (req, res) => {
  const { uid, name, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        password: uid, // just a placeholder
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'User stored/updated',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Placeholder for Login
exports.loginUser = (req, res) => {
  res.status(200).json({ message: 'Login placeholder' });
};

// Placeholder for Signup
exports.signupUser = (req, res) => {
  res.status(200).json({ message: 'Signup placeholder' });
};
