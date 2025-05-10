import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './src/routes/userRoutes.js';
import createUserCollection from './src/migrations/createUserCollection.js';
import createExamCollection from './src/migrations/createExamCollection.js';
import createStudentCollection from './src/migrations/createStudentCollection.js';
import createResultCollection from './src/migrations/createResultCollection.js';
import seedUsers from './src/seeds/userSeeds.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Run migrations
    await createUserCollection();
    await createExamCollection();
    await createStudentCollection();
    await createResultCollection();
    console.log('Migrations completed');
    
    // Run seeds
    await seedUsers();
    console.log('Seeds completed');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});