// utils/cache.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 120 }); // cache for 2 minutes
module.exports = cache;
