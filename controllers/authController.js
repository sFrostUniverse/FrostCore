const User = require('../models/user');

exports.googleSignIn = async (req, res) => {
  const { uid, name, email } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        password: uid // temporary password; not used
      });
    }

    res.status(200).json({ message: 'User stored/updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
