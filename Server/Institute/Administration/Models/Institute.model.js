import mongoose from "mongoose";

// Institute Schema
const instituteSchema = new mongoose.Schema(
  {
    instituteId: {
      type: String,
      required: true,
      unique: true, // primary key
    },
    instituteName: {
      type: String,
      required: true,
      trim: true,
    },
    instituteLocation: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true
    },
    primaryEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    primaryPhoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    access: {
      type: String,
      enum: ['allowed', 'restricted'],
      default: 'allowed'
    },
    activeStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    
    // User Management Section
    users: {
      // Teaching Staff
      teachers: {
        type: [String], // Array of teacher IDs
        default: [],
        ref: 'Teacher'
      },
      
      // Administrative Staff
      employees: {
        type: [String], // Array of employee IDs
        default: [],
        ref: 'Employee'
      },
      
      // Student Body
      students: {
        type: [String], // Array of student IDs
        default: [],
        ref: 'Student'
      },
      
      // Parent Community
      parents: {
        type: [String], // Array of parent IDs
        default: [],
        ref: 'Parent'
      }
    },
    programs: {
      type: [String],
      default: [],
    },
    
    // Institute Configuration
    maxCapacity: {
      teachers: { type: Number, default: 100 },
      employees: { type: Number, default: 50 },
      students: { type: Number, default: 1000 },
      parents: { type: Number, default: 1000 }
    },
  },
  { timestamps: true }
);

export default mongoose.model("Institute", instituteSchema);
