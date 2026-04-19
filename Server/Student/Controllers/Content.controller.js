import StudentContentModel from "../../aiMentor/models/StudentContent.model.js"
import { v4 as uuidv4 } from "uuid";


// GET /api/content?syllabusId=...  or  GET /api/content  (all)
export const getAllData = async (req, res, next) => {
  try {
    const { syllabusId, subjectId, studentId } = req.query;
    console.log(studentId)

    const filter = {};
    if (syllabusId) filter.syllabusId = syllabusId;
    if (subjectId) filter.subjectId = subjectId;
    if (studentId) filter.studentId = studentId;

    const data = await StudentContentModel.find(filter).lean();

    if (!data.length) {
      return res.status(404).json({
        success: false,
        message: "No content found",
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};