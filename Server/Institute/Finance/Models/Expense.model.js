import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    expenseId: {
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
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      enum: ['Utilities', 'Salaries', 'Rent', 'Supplies', 'Maintenance', 'Marketing', 'Other'],
      required: [true, 'Category is required'],
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    paidBy: {
      type: String,
      ref: 'Employee', // Assuming an employee handles this
      required: true,
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
expenseSchema.index({ instituteId: 1, category: 1 });
expenseSchema.index({ expenseDate: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;

