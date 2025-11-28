import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
      instituteId: {
        type: String,
        required: true,
      },
      employeeId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      gender: {
        type: String,
        required: true,
      },
      DOB: {
        type: Date,
        required: true,
      },
      nationality: {
        type: String,
        required: true,
      },
      maritalStatus: {
        type: String,
        required: true,
      },
      permanentAddress: {
        type: String,
        required: true,
      },
      currentAddress: {
        type: String,
        required: true,
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
      imagePath: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      joiningDate: {
        type: Date,
        required: true,
      },
      employmentType: {
        type: String,
        enum: ["fullTime", "partTime"],
        required: true,
      },
      supervisor: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "teacherManagement", "studentManagement", "employeeManagement", "financeManagement", "communicationManagement", "contentManagement", "academicManagement"],
        default: "",
      },
      educationQualification: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      access: {
        type: String,
        enum: ["allowed", "not allowed"],
        default: "not allowed",
      }
    },
    { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);