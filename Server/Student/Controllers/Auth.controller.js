import Student from "../../Institute/Student/Models/Student.model.js";
import { errorHandler } from "../../Utils/Error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Student login
 * @route POST /api/student/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }

    // Find student by email
    const student = await Student.findOne({ email }).select("+password");
    if (!student) {
      return next(errorHandler(404, "Student not found"));
    }

    // Check if student is allowed access
    if (student.access !== "allowed") {
      return next(errorHandler(403, "Access denied for this student"));
    }

    // Compare passwords
    const isMatch = await bcryptjs.compare(password, student.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: student._id,
        studentId: student.studentId,
        role: "student",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send response with HTTP-only cookie
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "Login successful",
        data: {
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          access: student.access,
          batches: student.batches,
        },
      });
  } catch (error) {
    next(errorHandler(500, error.message || "Login failed"));
  }
};