import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    programId: {
      type: String,
      required: [true, "Program ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    programName: {
      type: String,
      required: [true, "Program name is required"],
      trim: true,
      maxlength: [100, "Program name cannot exceed 100 characters"],
    },
    instituteId: {
      type: String,
      ref: "Institute",
      required: [true, "Institute ID is required"],
    },
    batchIds: [
      {
        type: String,
        ref: "Batch",
      },
    ],
    studentIds: [
      {
        type: String,
        ref: "Student",
      },
    ],
    subjects: [
      {
        subjectId: {
          type: String,
          ref: "Subject",
          required: true,
        },
        teacherIds: [
          {
            type: String,
            ref: "Teacher",
          },
        ],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    programType: {
      type: String,
      default: "Full-time",
    },
    duration: {
      type: Number, // Duration in months
      min: [1, "Duration must be at least 1 month"],
    },
    enrolled: {
      type: Number,
      default: 0,
      min: [0, "Enrolled students cannot be negative"],
    },
    capacity: {
      type: Number,
      min: [1, "Capacity must be at least 1"],
    },
    startDate: {
      type: Date,
    },
    fee: {
      type: Number,
      min: [0, "Fee cannot be negative"],
    },
    level: {
      type: String,
      default: "Beginner",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
programSchema.index({ instituteId: 1, programName: 1 });
programSchema.index({ "subjects.subjectId": 1 });
programSchema.index({ studentIds: 1 });

// Virtual for checking if program is full
programSchema.virtual("isFull").get(function () {
  return this.capacity ? this.enrolled >= this.capacity : false;
});

// Virtual for available seats
programSchema.virtual("availableSeats").get(function () {
  return this.capacity ? this.capacity - this.enrolled : null;
});

// Pre-save middleware to validate dates
programSchema.pre("save", function (next) {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    next(new Error("End date must be after start date"));
  }
  next();
});

const Program = mongoose.model("Program", programSchema);

export default Program;
