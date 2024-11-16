import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { appointmentRouter } from './routes/appointment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zest')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRouter);
app.use('/api/appointments', appointmentRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});