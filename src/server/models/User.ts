import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['dentist', 'admin'],
    default: 'dentist',
  },
  specialization: String,
  experience: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);