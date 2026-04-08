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
      },
      DOB: {
        type: Date,
      },
      nationality: {
        type: String,
      },
      maritalStatus: {
        type: String,
      },
      permanentAddress: {
        type: String,
      },
      currentAddress: {
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
      imagePath: {
        type: String,
      },
      department: {
        type: String,
      },
      designation: {
        type: String,
      },
      joiningDate: {
        type: Date,
      },
      employmentType: {
        type: String,
        enum: ["fullTime", "partTime"],
      },
      supervisor: {
        type: String,
      },
      role: {
        type: String,
        enum: ["admin", "teacherManagement", "studentManagement", "employeeManagement", "financeManagement", "communicationManagement", "contentManagement", "academicManagement"],
        default: "",
      },
      educationQualification: {
        type: String,
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