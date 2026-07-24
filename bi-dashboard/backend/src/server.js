require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const app = require('./app');
const { port } = require('./config/env');
const { initDB } = require('./db');

const startServer = async () => {
  try {
    await initDB();
    console.log('Connected to PostgreSQL');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
