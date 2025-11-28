import mongoose from 'mongoose';

const deductionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const bonusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const salarySchema = new mongoose.Schema(
  {
    salaryId: {
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
    employeeId: {
      type: String,
      ref: 'Employee',
      required: true,
    },
    grossSalary: {
      type: Number,
      required: [true, 'Gross salary is required'],
      min: [0, 'Gross salary cannot be negative'],
    },
    netSalary: {
      type: Number,
      required: [true, 'Net salary is required'],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
salarySchema.index({ instituteId: 1, employeeId: 1 });
salarySchema.index({ month: 1, year: 1 });

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;

