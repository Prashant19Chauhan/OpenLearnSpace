import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
      instituteId: {
        type: String,
        required: true,
      },
      studentId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      DOB: {
        type: Date,
        required: true,
      },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      imagePath: {
        type: String,
      },
      phoneNumber: {
        type: String,
        required: true,
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
      admissionDate: {
        type: Date,
        default: Date.now,
      },
      access: {
        type: String,
        enum: ["allowed", "not allowed"],
        default: "not allowed",
      },
      programIds:{
        type: [String],
        default: [],
      },
      batchIds: {
        type: [String],
        default: [],
      },
      rollNumber: {
        type: String,
        default: null,
      },
      // Parent information embedded directly in student
      parentName: {
        type: String,
        required: true,
        trim: true,
      },
      parentPhoneNumber: {
        type: String,
        required: true,
      },
      parentEmail: {
        type: String,
        required: true,
        lowercase: true,
      },
      relation: {
        type: String,
        required: true,
      },
      occupation: {
        type: String,
        required: true,
      },
      emergencyContact: {
        type: String,
        required: true,
      },
      parentPassword: {
        type: String,
        required: true,
      }
    },
    { timestamps: true }
);

export default mongoose.model("Student", studentSchema);