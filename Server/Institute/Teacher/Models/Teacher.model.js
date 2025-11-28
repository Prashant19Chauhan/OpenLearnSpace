import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
      instituteId: {
        type: String,
        required: true,
      },
      teacherId: {
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
      qualification: {
        type: String,
        required: true,
      },
      experience: {
        type: Number,
        default: 0,
      },
      address: {
        type: String,
        default: "",
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
      subjects: {
        type: [String],
        default: [],
      },
      department: {
        type: String,
        default: "",
      },
      employementStatus: {
        type: String,
        enum: ["fullTime", "partTime", "contract"],
        default: "fullTime",
      },
      imagePath: {
        type: String,
        default: "",
      }
    },
    { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);