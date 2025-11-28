import Teacher from "../../Institute/Teacher/Models/Teacher.model.js";
import { errorHandler } from "../../Utils/Error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Teacher login
 * @route POST /api/teacher/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email }).select("+password");
    if (!teacher) {
      return next(errorHandler(404, "Teacher not found"));
    }

    // Check if teacher is allowed access
    if (teacher.access !== "allowed") {
      return next(errorHandler(403, "Access denied for this teacher"));
    }

    // Compare passwords
    const isMatch = await bcryptjs.compare(password, teacher.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: teacher._id,
        teacherId: teacher.teacherId,
        role: "teacher",
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
          teacherId: teacher.teacherId,
          name: teacher.name,
          email: teacher.email,
          access: teacher.access,
          subjects: teacher.subjects,
        },
      });
  } catch (error) {
    next(errorHandler(500, error.message || "Login failed"));
  }
};