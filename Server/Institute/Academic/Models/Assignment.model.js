import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({

  assignmentId: {
    type: String,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  dueDate: {
    type: Date
  },

  batchId: {
    type: String,
    required: true
  },

  subjectId: {
    type: String
  },

  teacherId: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  isActive: {
    type: Boolean,
    default: true
  }

});

const AssignmentModel =
  mongoose.model("Assignment", AssignmentSchema);

export default AssignmentModel;