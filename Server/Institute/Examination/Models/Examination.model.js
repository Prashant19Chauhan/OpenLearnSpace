import mongoose from "mongoose";

const examinationSchema = new mongoose.Schema(
  {
    examId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Exam name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: ["quiz", "test", "exam", "assignment"],
      required: true,
    },
    subjectIds: [
      {
        type: String,
        ref: "Subject",
        required: true,
      },
    ],
    batchId: {
      type: String,
      ref: "Batch",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    duration: {
      type: Number,
      required: true,
      min: [1, "Duration must be at least 1 minute"],
      message: "Duration must be a positive number",
    },
    totalMarks: {
      type: Number,
      required: true,
      min: [1, "Total marks must be at least 1"],
    },
    passingMarks: {
      type: Number,
      required: true,
      min: [1, "Passing marks must be at least 1"],
      validate: {
        validator: function (value) {
          return value <= this.totalMarks;
        },
        message: "Passing marks cannot exceed total marks",
      },
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          enum: ["multiple_choice", "true_false", "essay", "short_answer"],
          required: true,
        },
        options: {
          type: [String],
          validate: {
            validator: function (arr) {
              return arr.length >= 2 && arr.length <= 10;
            },
            message: "Options must have 2 to 10 items",
          },
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        marks: {
          type: Number,
          required: true,
          min: [1, "Question marks must be at least 1"],
        },
      },
    ],
    access: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
examinationSchema.index({ examId: 1 });
examinationSchema.index({ batchId: 1 });
examinationSchema.index({ subjectIds: 1 });
examinationSchema.index({ startDate: 1 });
examinationSchema.index({ endDate: 1 });
examinationSchema.index({ status: 1 });

const Examination = mongoose.model("Examination", examinationSchema);

export default Examination;