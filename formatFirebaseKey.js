const fs = require('fs');

const serviceAccount = require('./config/firebaseServiceAccount.json');

serviceAccount.private_key = serviceAccount.private_key.replace(/\n/g, '\\n');

const envSafeJson = JSON.stringify(serviceAccount);

console.log(envSafeJson);
