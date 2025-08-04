const jwt = require('jsonwebtoken');
require('dotenv').config(); // ✅ Load .env

const token = jwt.sign(
  {
    id: '688fc5305e1a744cb6f19a80', // your user ID
    email: 'frostyyuniverse@gmail.com',
  },
  process.env.JWT_SECRET, // ✅ Load from .env (superfrostsecret)
  { expiresIn: '7d' }
);

console.log('JWT Token:', token);
