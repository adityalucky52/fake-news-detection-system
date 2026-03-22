
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './database/prisma.js';

const port = process.env.PORT || 8000;

// Validate DB connection before listening
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL connected via Prisma');
    app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();

