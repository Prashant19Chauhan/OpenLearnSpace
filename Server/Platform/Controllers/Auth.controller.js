import { errorHandler } from "../../Utils/Error.js";
import bcryptjs from "bcryptjs";
import AdminUser from "../Models/Admin.model.js";
import RefreshToken from "../Models/RefreshToken.model.js";
import jwt from "jsonwebtoken";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone); // Indian number
const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).{8,}$/.test(password);

const generateTokens = async(user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role, scope: "platform" },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role, scope: "platform" },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  await RefreshToken.create({
    token: refreshToken,
  });
  return { accessToken, refreshToken };
}

export const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password || email.trim() === "" || password.trim() === "") return next(errorHandler(400, "All fields are required"))
    
        const user = await AdminUser.findOne({ email });
        if (!user) return next(errorHandler(400, "User doesn't exist"));
    
        if (user.role === "user")
          return next(errorHandler(403, "User not authorized as admin"));

        console.log(await bcryptjs.hash(password, 10));
    
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return next(errorHandler(400, "Invalid credentials!"));
    
        const tokens = await generateTokens(user)
    
        res
          .status(200)
          .cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          })
          .json({
            success: true,
            message: "Login successful!",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              permissions: user.permissions,
            },
            accessToken: tokens.accessToken
          });
    } catch (err) {
        return next(errorHandler( 500, err.message || "Login failed"));
    }
}

export const register = async (req, res, next) => {
  const { name, username, email, phoneNumber, password, role } = req.body;

  try {
    if (!isValidEmail(email)) return next(errorHandler( 400, "Invalid email format"));
    if (!isValidPhone(phoneNumber)) return next(errorHandler( 400, "Invalid Indian phone number"));
    if (!isValidPassword(password))
      return next(errorHandler( 400, "Password must have 1 uppercase, 1 number, 1 special symbol (.,!@#), min 8 chars"));

    const findUser = await AdminUser.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });

    if (findUser) return next(errorHandler(409, "User already exists"));

    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = new AdminUser({
      name,
      username,
      email,
      phoneNumber,
      password: hashPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return next(errorHandler( 500, error.message || "User creation failed"));
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
      { userId: user.userId, role: user.role, scope: "platform" },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  });
};

