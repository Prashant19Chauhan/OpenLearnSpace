import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
    {
      instituteId: {
        type: String,
        required: true,
      },
      parentId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      joiningDate: {
        type: Date,
        default: Date.now,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      access: {
        type: String,
        enum: ["allowed", "not allowed"],
        default: "not allowed",
      },
      studentsId: {
        type: [String],
        required: true,
        default: []
      }
    },
    { timestamps: true }
);

export default mongoose.model("Parent", parentSchema);