import mongoose from "mongoose"

const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: [true, "Batch ID is required"],
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, "Batch name is required"],
    trim: true,
    maxlength: [100, "Batch name cannot exceed 100 characters"]
  },
  instituteId: {
    type: String,
    ref: "Institute",
    required: [true, "Institute ID is required"]
  },
  programId: {
    type: String,
    ref: "Program",
    required: [true, "Program ID is required"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Batch description cannot exceed 500 characters"]
  },
  startDate: {
    type: Date,
    required: [true, "Batch start date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "Batch end date is required"]
  },
  maxStudents: {
    type: Number,
    min: [1, "Maximum students must be at least 1"],
    default: 30
  },
  currentEnrollment: {
    type: Number,
    default: 0,
    min: [0, "Current enrollment cannot be negative"]
  },
  subjects: [{
    subjectId: {
      type: String,
      ref: "Subject",
      required: true
    },
    teacherIds: [{
      type: String,
      ref: "Teacher"
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  studentIds: [{
    type: String,
    ref: "Student"
  }],
}, {
  timestamps: true
})

// Indexes for better query performance
batchSchema.index({ instituteId: 1, programId: 1 })
batchSchema.index({ startDate: 1, endDate: 1 })
batchSchema.index({ batchStatus: 1 })
batchSchema.index({ isActive: 1 })

// Virtual for checking if batch is full
batchSchema.virtual('isFull').get(function() {
  return this.maxStudents ? this.currentEnrollment >= this.maxStudents : false
})

// Virtual for available seats
batchSchema.virtual('availableSeats').get(function() {
  return this.maxStudents ? this.maxStudents - this.currentEnrollment : null
})

const Batch = mongoose.model("Batch", batchSchema)

export default Batch