import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import InstituteEmployee from "../Models/Employee.model.js";
import { errorHandler } from "../../../Utils/Error.js";
import RefreshToken from "../Models/RefreshToken.model.js";

const generateTokens = async(user) => {
  const accessToken = jwt.sign(
    { instituteId: user.instituteId, userId: user.employeeId, role: user.role, scope: "institute" },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { instituteId: user.instituteId, userId: user.employeeId, role: user.role, scope: "institute" },
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
    const { email, password, instituteId } = req.body;

    if (!instituteId || !email || !password) {
      return next(errorHandler(400, "InstituteId, Email and Password are required"));
    }

    // First find the employee by email from Employee model
    const employee = await InstituteEmployee.findOne({ email: email });
    if (!employee) {
      return next(errorHandler(404, "Employee not found with this email"));
    }

    // Check if the institute ID matches the employee's institute ID
    if (employee.instituteId !== instituteId) {
      return next(errorHandler(403, "Employee does not belong to this institute"));
    }

    // Compare password
    const isPasswordValid = await bcryptjs.compare(password, employee.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Check if employee has access
    if (employee.access !== "allowed") {
      return next(errorHandler(403, "Access denied. Please contact administrator"));
    }

    // Generate JWT
    const tokens = await generateTokens(employee)

    // Return safe employee data
    res
      .status(200)
      .cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          instituteId: employee.instituteId,
          permissions: employee.permissions,
          access: employee.access,
          joiningDate: employee.joiningDate
        },
        accessToken: tokens.accessToken
      });
  } catch (error) {
    return next(errorHandler(500, error.message || "Login failed"));
  }
};


export const logout = async(req, res) => {
  const refreshToken = req.cookies.refresh_token;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.clearCookie("refresh_token");
  res.json({ message: "Logged out" });
};

export const refresh = async(req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!refreshToken || !storedToken) return next(errorHandler(403, "Invalid refresh token"));

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Invalid refresh token"));

    const newAccessToken = jwt.sign(
      { instituteId: user.instituteId, userId: user.employeeId, role: user.role, scope: "institute" },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  });
};

