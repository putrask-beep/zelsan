const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { initDB } = require('../backend/src/db');

const setupDB = async () => {
  try {
    await initDB();
    console.log('Database setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
};

setupDB();
