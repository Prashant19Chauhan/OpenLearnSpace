import Institute from "../Models/Institute.model.js"
import Teacher from "../../Teacher/Models/Teacher.model.js"
import { errorHandler } from "../../../Utils/Error.js"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone); // Indian number
const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).{8,}$/.test(password);

export const hireTeacher = async(req, res, next) => {
    try {
        const { instituteId } = req.user;
        const { 
            name, 
            phoneNumber, 
            email,
            address,
            qualification,
            department, 
            subjects,
            experience,
            joiningDate,
            employementStatus
        } = req.body;
        const imagePath = req.file ? req.file.filename : null;

        // Validate required fields
        if (!instituteId || !name || !phoneNumber || !email) {
            return next(errorHandler(400, "Missing required fields"));
        }

        if(isValidEmail(email) === false) return next(errorHandler(400, "Invalid email format"))
        if(isValidPhone(phoneNumber) === false) return next(errorHandler(400, "Invalid Indian phone number"))

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if teacher already exists in this institute with this email
        const existingTeacher = await Teacher.findOne({ instituteId, email });
        if (existingTeacher) {
            return next(errorHandler(409, "Teacher already exists with this email in this institute"));
        }

        const password = "Moodle@123"
        const hashPassword = await bcrypt.hash(password, 10);
        const teacherId = "INST-TEACH-" + nanoid(12);
        
        // Create new teacher using Teacher model
        const newTeacher = new Teacher({
            teacherId: teacherId,
            instituteId: instituteId,
            name,
            phoneNumber,
            address,
            qualification,
            experience: experience || 0,
            email: email.toLowerCase(),
            password: hashPassword,
            department: department || "",
            subjects: subjects || [],
            joiningDate: joiningDate || new Date(),
            employementStatus: employementStatus || "fullTime",
            imagePath: imagePath,
            access: "allowed" // Default access status
        });

        // Save teacher to database
        await newTeacher.save();

        // Add teacher to institute's users.teachers array
        institute.users.teachers.push(teacherId);
        await institute.save();
        
        res.status(201).json({
            success: true,
            message: "Teacher hired successfully",
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const resignTeacher = async(req, res, next) => {
    try {
        const { instituteId, teacherId } = req.body;

        // Validate required fields
        if (!instituteId || !teacherId) {
            return next(errorHandler(400, "Institute ID and Teacher ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if teacher exists in institute's users.teachers array
        const teacherExistsInInstitute = institute.users.teachers.includes(teacherId);
        if (!teacherExistsInInstitute) {
            return next(errorHandler(404, "Teacher not found in this institute"));
        }

        // Find teacher details from Teacher collection
        const teacher = await Teacher.findOne({ instituteId, teacherId });
        if (!teacher) {
            return next(errorHandler(404, "Teacher details not found"));
        }

        // Remove teacher from institute's users.teachers array
        institute.users.teachers = institute.users.teachers.filter(id => id !== teacherId);
        await institute.save();

        // Delete teacher from Teacher collection
        await Teacher.deleteOne({ instituteId, teacherId });

        // Return success response (excluding password)
        const teacherObj = teacher.toObject ? teacher.toObject() : teacher;
        const { password: _, ...teacherResponse } = teacherObj;

        res.status(200).json({
            success: true,
            message: "Teacher resigned successfully",
            data: teacherResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const findTeacherDetails = async(req, res, next) => {
    try {
        const { instituteId } =  req.user;
        const { teacherId } = req.params;

        // Validate required fields
        if (!instituteId || !teacherId) {
            return next(errorHandler(400, "Institute ID and Teacher ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if teacher exists in institute's users.teachers array
        const teacherExistsInInstitute = institute.users.teachers.includes(teacherId);
        if (!teacherExistsInInstitute) {
            return next(errorHandler(404, "Teacher not found in this institute"));
        }

        // Find teacher details from Teacher collection
        const teacher = await Teacher.findOne({ instituteId, teacherId });
        if (!teacher) {
            return next(errorHandler(404, "Teacher details not found"));
        }

        // Return teacher details (excluding password)
        const teacherObj = teacher.toObject ? teacher.toObject() : teacher;
        const { password: _, ...teacherResponse } = teacherObj;

        res.status(200).json({
            success: true,
            message: "Teacher details retrieved successfully",
            data: teacherResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const updateTeacherDetails = async(req, res, next) => {
    try {
        const { instituteId, teacherId, ...updateData } = req.body;

        // Validate required fields
        if (!instituteId || !teacherId) {
            return next(errorHandler(400, "Institute ID and Teacher ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if teacher exists in institute's users.teachers array
        const teacherExistsInInstitute = institute.users.teachers.includes(teacherId);
        if (!teacherExistsInInstitute) {
            return next(errorHandler(404, "Teacher not found in this institute"));
        }

        // Find teacher from Teacher collection
        const teacher = await Teacher.findOne({ instituteId, teacherId });
        if (!teacher) {
            return next(errorHandler(404, "Teacher details not found"));
        }

        // Validate email format if email is being updated
        if (updateData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updateData.email)) {
                return next(errorHandler(400, "Invalid email format"));
            }
            updateData.email = updateData.email.toLowerCase();
        }

        // Check if email already exists (if email is being updated)
        if (updateData.email) {
            const emailExists = await Teacher.findOne({ 
                instituteId, 
                email: updateData.email, 
                teacherId: { $ne: teacherId } 
            });
            if (emailExists) {
                return next(errorHandler(409, "Email already exists with another teacher"));
            }
        }

        // Update teacher details
        const updatedTeacher = await Teacher.findOneAndUpdate(
            { instituteId, teacherId },
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        // Return updated teacher details (excluding password)
        const teacherObj = updatedTeacher.toObject ? updatedTeacher.toObject() : updatedTeacher;
        const { password: _, ...teacherResponse } = teacherObj;

        res.status(200).json({
            success: true,
            message: "Teacher details updated successfully",
            data: teacherResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const findAllTeachersDetails = async(req, res, next) => {
    try {
        const instituteId  = req.user || "INST-qGLjEmoqjohh";

        // Validate required fields
        if (!instituteId) {
            return next(errorHandler(400, "Institute ID is required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Get all teachers from Teacher collection for this institute
        const teachers = await Teacher.find({ instituteId }, "teacherId name subjects department experience email phoneNumber imagePath access");


        res.status(200).json({
            success: true,
            message: "All teachers details retrieved successfully",
            count: teachers.length,
            data: teachers
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}