import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema({
  subjectId: {
    type: String,
    required: [true, "Subject ID is required"],
    unique: true,
    trim: true,
    uppercase: true,
  },
  subjectName: {
    type: String,
    required: [true, "Subject name is required"],
    trim: true,
    maxlength: [100, "Subject name cannot exceed 100 characters"]
  },
  subjectCode: {
    type: String,
    required: [true, "Subject code is required"],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [20, "Subject code cannot exceed 20 characters"]
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
  batchId: {
    type: String,
    ref: "Batch"
  },
  subjectDescription: {
    type: String,
    trim: true,
    maxlength: [1000, "Subject description cannot exceed 1000 characters"]
  },
  teachersAssigned: [{
    type: String,
    ref: "Teacher"
  }],
  syllabus: {
    topics: [{
      title: {
        type: String,
        trim: true,
        maxlength: [200, "Topic title cannot exceed 200 characters"]
      },
      description: {
        type: String,
        trim: true,
        maxlength: [500, "Topic description cannot exceed 500 characters"]
      },
    }],
  },
  resources: {
    textbooks: [{
      title: {
        type: String,
        trim: true,
        maxlength: [200, "Textbook title cannot exceed 200 characters"]
      },
      author: {
        type: String,
        trim: true,
        maxlength: [100, "Author name cannot exceed 100 characters"]
      },
      isbn: {
        type: String,
        trim: true,
        maxlength: [20, "ISBN cannot exceed 20 characters"]
      },
      isRequired: {
        type: Boolean,
        default: false
      }
    }],
    onlineResources: [{
      title: {
        type: String,
        trim: true,
        maxlength: [200, "Resource title cannot exceed 200 characters"]
      },
      url: {
        type: String,
        trim: true,
        maxlength: [500, "URL cannot exceed 500 characters"]
      },
      description: {
        type: String,
        trim: true,
        maxlength: [300, "Description cannot exceed 300 characters"]
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: true
})

// Indexes for better query performance
subjectSchema.index({ instituteId: 1, programId: 1 })
subjectSchema.index({ subjectType: 1 })
subjectSchema.index({ difficulty: 1 })
subjectSchema.index({ isActive: 1 })

const Subject = mongoose.model("Subject", subjectSchema)

export default Subject