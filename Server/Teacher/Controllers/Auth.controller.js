import Teacher from "../../Institute/Teacher/Models/Teacher.model.js";
import { errorHandler } from "../../Utils/Error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import RefreshToken from "../../Platform/Models/RefreshToken.model.js";

/**
 * Teacher login
 * @route POST /api/teacher/auth/login
 * @access Public
 */

const generateTokens = async(user) => {
  const accessToken = jwt.sign(
    { instituteId: user.instituteId, userId: user.teacherId, role: 'teacher', scope: "teacher" },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { instituteId: user.instituteId, userId: user.teacherId, role: 'teacher', scope: "teacher" },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  await RefreshToken.create({
    token: refreshToken,
  });
  return { accessToken, refreshToken };
}


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
        console.log(teacher)
    const token = await generateTokens(teacher)
    console.log(token)

    // Send response with HTTP-only cookie
    res
      .status(200)
      .cookie("access_token", token.refreshToken, {
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
        accessToken: token.accessToken
      });
  } catch (error) {
    next(errorHandler(500, error.message || "Login failed"));
  }
};