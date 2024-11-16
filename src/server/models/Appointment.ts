import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  dentist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);