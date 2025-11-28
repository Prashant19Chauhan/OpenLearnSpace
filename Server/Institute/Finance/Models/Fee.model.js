import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema(
  {
    feeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    instituteId: {
      type: String,
      ref: 'Institute',
      required: [true, 'Institute ID is required'],
    },
    studentId: {
      type: String,
      ref: 'Student',
      required: [true, 'Student ID is required'],
    },
    programId: {
      type: String,
      ref: 'Program',
      required: [true, 'Program ID is required'],
    },
    batchId: {
      type: String,
      ref: 'Batch',
      required: [true, 'Batch ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Fee amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Amount paid cannot be negative'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Partially Paid', 'Overdue'],
      default: 'Unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Online', 'Bank Transfer', 'Other'],
    },
    transactionId: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
FeeSchema.index({ instituteId: 1, studentId: 1 });
FeeSchema.index({ programId: 1, batchId: 1 });

export default mongoose.model('Fee', FeeSchema);

