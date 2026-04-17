import mongoose from "mongoose";

const AssignmentReportSchema =
new mongoose.Schema({

  assignmentId: {
    type: String,
    required: true
  },

  batchId: {
    type: String,
    required: true
  },

  students: [
    {
      studentId: String,

      name: String,

      submitted: {
        type: Boolean,
        default: false
      },

      marks: {
        type: Number,
        default: 0
      }
    }
  ],

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

const AssignmentReportModel =
mongoose.model(
  "AssignmentReport",
  AssignmentReportSchema
);

export default AssignmentReportModel;