import ProgramModel from "../../Institute/Academic/Models/Program.model.js";
import StudentModel from "../../Institute/Student/Models/Student.model.js";
import BatchModel from "../../Institute/Academic/Models/Batch.model.js";
import ContentModel from "../../Institute/Content/Models/Content.model.js";
import ExaminationModel from "../../Institute/Examination/Models/Examination.model.js";
import { errorHandler } from "../../Utils/Error.js";

/**
 * Get program details for a specific student
 * @route GET /api/student/program/:studentId
 * @access Private
 */
export const getStudentProgram = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Step 1: Find the student by ID
    const student = await StudentModel.findOne({ studentId });

    if (!student) {
      return next(errorHandler(404, "Student not found"));
    }

// Step 2: Extract programIds from the student
    const { programIds } = student;

    if (!programIds || programIds.length === 0) {
      return next(errorHandler(404, "Student is not enrolled in any programs"));
    }

    // Step 3: Find all programs using the programIds
    const programs = await ProgramModel.find({ programId: { $in: programIds } })

    if (!programs || programs.length === 0) {
      return next(errorHandler(404, "No programs found"));
    }

    // Step 4: Return all program details
    res.status(200).json({
      success: true,
      message: "Student programs retrieved successfully",
      data: programs,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get student's enrolled batches for a specific program
 * @route GET /api/student/program/:programId/batches/:studentId
 * @access Private (Student)
 */
export const getStudentProgramBatches = async (req, res, next) => {
  try {
    const { programId, studentId } = req.params;

    // Step 1: Validate that both IDs are provided
    if (!programId || !studentId) {
      return next(errorHandler(400, "Program ID and Student ID are required"));
    }

    // Step 2: Find the student by ID
    const student = await StudentModel.findOne({ studentId });
    if (!student) {
      return next(errorHandler(404, "Student not found"));
    }

    // Step 3: Find the program by ID
    const program = await ProgramModel.findOne({ programId });
    if (!program) {
      return next(errorHandler(404, "Program not found"));
    }

    // Step 4: Extract batch IDs from both student and program
    const studentBatchIds = student.batches; // Assuming 'batches' is the field in student model
    const programBatchIds = program.batchIds;

    // Step 5: Find matching batch IDs between student and program
    const matchingBatchIds = studentBatchIds.filter(batchId => 
      programBatchIds.includes(batchId)
    );

    if (matchingBatchIds.length === 0) {
      return next(errorHandler(404, "Student is not enrolled in any batches for this program"));
    }

    // Step 6: Fetch details of matching batches
    const batchDetails = await BatchModel.find({ 
      batchId: { $in: matchingBatchIds } 
    })

    res.status(200).json({
      success: true,
      message: "Student's program batches retrieved successfully",
      data: {
        program: {
          programId: program.programId,
          programName: program.programName
        },
        batches: batchDetails
      }
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

/**
 * Get all subject details for a specific batch
 * @route GET /api/student/batch/:batchId/subjects
 * @access Private (Student)
 */
export const getBatchSubjects = async (req, res, next) => {
  try {
    const { batchId } = req.params;

    // Step 1: Find the batch by batchId
    const batch = await BatchModel.findOne({ batchId });

    if (!batch) {
      return next(errorHandler(404, "Batch not found"));
    }

    // Step 2: Extract subjectIds from the batch's subjects array
    const subjectIds = batch.subjects.map(subject => subject.subjectId);

    if (subjectIds.length === 0) {
      return next(errorHandler(404, "No subjects found in this batch"));
    }

    // Step 3: Find all subjects in the Subject model
    const subjects = await SubjectModel.find({ subjectId: { $in: subjectIds } });

    if (subjects.length === 0) {
      return next(errorHandler(404, "No subjects found for this batch"));
    }

    // Step 4: Return the subject details
    res.status(200).json({
      success: true,
      message: "Batch subjects retrieved successfully",
      data: subjects,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
}

/**
 * Get comprehensive details of a subject including content, teachers, and exams
 * @route GET /api/student/subject/:subjectId/details
 * @access Private (Student)
 */
export const getSubjectComprehensiveDetails = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    // Step 1: Find the subject by ID
    const subject = await SubjectModel.findOne({ subjectId });
    if (!subject) {
      return next(errorHandler(404, "Subject not found"));
    }

    // Step 2: Get teacher details assigned to this subject
    const teacherIds = subject.teachersAssigned || [];
    const teacherDetails = await TeacherModel.find(
      { teacherId: { $in: teacherIds } },
      // Exclude sensitive information
      { password: 0, access: 0 }
    );

    // Step 3: Get content associated with this subject
    const contentItems = await ContentModel.find({
      subjectIds: { $in: [subjectId] },
      access: "public" // Only fetch publicly accessible content
    }).sort({ createdAt: -1 });

    // Step 4: Get examinations associated with this subject
    const examinations = await ExaminationModel.find({
      subjectIds: { $in: [subjectId] },
      // Only fetch exams that are scheduled or active
      status: { $in: ["scheduled", "active"] }
    }).select("-questions.correctAnswer"); // Exclude answers for security

    // Step 5: Construct and return the comprehensive response
    res.status(200).json({
      success: true,
      message: "Subject comprehensive details retrieved successfully",
      data: {
        subject: {
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          subjectDescription: subject.subjectDescription,
          programId: subject.programId,
          batchId: subject.batchId,
          syllabus: subject.syllabus,
          resources: subject.resources
        },
        teachers: teacherDetails.map(teacher => ({
          teacherId: teacher.teacherId,
          name: teacher.name,
          email: teacher.email,
          subjects: teacher.subjects
        })),
        content: contentItems.map(content => ({
          contentId: content.contentId,
          name: content.name,
          description: content.description,
          type: content.type,
          createdAt: content.createdAt
        })),
        examinations: examinations.map(exam => ({
          examId: exam.examId,
          name: exam.name,
          type: exam.type,
          startDate: exam.startDate,
          endDate: exam.endDate,
          duration: exam.duration,
          totalMarks: exam.totalMarks,
          passingMarks: exam.passingMarks,
          status: exam.status,
          questionCount: exam.questions ? exam.questions.length : 0
        }))
      }
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};




