import mongoose from "mongoose";

const communicationSchema = new mongoose.Schema(
  {
    communicationId: {
      type: String,
      required: [true, "Communication ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    instituteId: {
      type: String,
      ref: "Institute",
      required: [true, "Institute ID is required"],
    },
    programId: {
      type: String,
      ref: "Program",
    },
    batchId: {
      type: String,
      ref: "Batch",
    },
    subjectId: {
      type: String,
      ref: "Subject",
    },

    // "notice" or "complain"
    type: {
      type: String,
      required: [true, "Communication type is required"],
      default: "notice",
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    // Replacing 'message' with 'content'
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [2000, "Content cannot exceed 2000 characters"],
    },

    // Optional extra fields from your API
    priority: {
      type: String,
      default: "normal",
    },

    targetAudience: {
      type: String,
      default: "all",
    },

    publishDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    publishedBy: {
      type: String,
      refPath: "publisherModel", // can reference Student/Teacher/Employee
    },

    publisherModel: {
      type: String,
    },

    createdBy: {
      type: String,
      refPath: "creatorModel",
    },

    creatorModel: {
      type: String,
    },
  },
  { timestamps: true }
);

// 🔹 Indexes for performance
communicationSchema.index({ instituteId: 1, type: 1 });
communicationSchema.index({ programId: 1, batchId: 1, subjectId: 1 });
communicationSchema.index({ publishDate: -1 });
communicationSchema.index({ expiryDate: 1 });

const Communication = mongoose.model("Communication", communicationSchema);
export default Communication;
