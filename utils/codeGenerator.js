const Group = require('../models/group');

async function generateUniqueGroupCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  while (true) {
    const code = Array.from({ length }, () =>
      characters[Math.floor(Math.random() * characters.length)]
    ).join('');

    const existing = await Group.findOne({ groupCode: code });
    if (!existing) return code;
  }
}

module.exports = generateUniqueGroupCode;
