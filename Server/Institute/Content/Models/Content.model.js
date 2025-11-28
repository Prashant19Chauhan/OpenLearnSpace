import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    contentId: {
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
      maxlength: [200, "Content name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: ["video", "document", "quiz", "audio", "image", "link"],
      required: true,
    },
    subjectIds: [
      {
        type: String,
        ref: "Subject",
        required: true,
      },
    ],
    access: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
contentSchema.index({ contentId: 1 });
contentSchema.index({ subjectIds: 1 });
contentSchema.index({ type: 1 });
contentSchema.index({ access: 1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;