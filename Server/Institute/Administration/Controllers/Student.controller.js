import Institute from "../Models/Institute.model.js"
import Student from "../../Student/Models/Student.model.js"
import Parent from "../../Parent/Models/Parent.model.js"
import { errorHandler } from "../../../Utils/Error.js"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone); // Indian number
const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).{8,}$/.test(password);

export const enrollStudent = async(req, res, next) => {
    console.log("hii")
    try {
        const {instituteId } = req.user;
        const {  
            name,
            DOB,
            gender,
            address,
            phoneNumber,
            email,
            AdmissionDate,
            parentName,
            parentPhoneNumber,
            parentEmail,
            relation,
            occupation,
            emergencyContact,
            programId,
            batchId,
        } = req.body;
        const imagePath = req.file ? req.file.filename : null;

        console.log(programId)
        console.log(batchId)
        // Validate required fields
        if (!instituteId || !name || !phoneNumber || !email ||
            !parentName || !parentPhoneNumber || !parentEmail) {
            return next(errorHandler(400, "Missing required fields"));
        }

        if(isValidEmail(email) === false) return next(errorHandler(400, "Invalid email format"))
        if(isValidPhone(phoneNumber) === false) return next(errorHandler(400, "Invalid Indian phone number"))
        if(isValidEmail(parentEmail) === false) return next(errorHandler(400, "Invalid parent email format"))
        if(isValidPhone(parentPhoneNumber) === false) return next(errorHandler(400, "Invalid parent Indian phone number"))

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if student already exists in this institute with this email
        const existingStudent = await Student.findOne({ instituteId, email });
        if (existingStudent) {
            return next(errorHandler(409, "Student already exists with this email in this institute"));
        }

        // Check if parent already exists in this institute with this email
        let existingParent = await Parent.findOne({ instituteId, email: parentEmail });
        let parentId;

        if (existingParent) {
            // Parent exists, use existing parent ID
            parentId = existingParent.parentId;
        } else {
            // Create new parent ID
            parentId = "INST-PARENT-" + nanoid(12);
        }

        const password = "Moodle@123";
        const hashPassword = await bcrypt.hash(password, 10);
        const parentHashPassword = await bcrypt.hash(password, 10);
        const studentId = "INST-STUDENT-" + nanoid(12);
        
        // Create new student
        const newStudent = new Student({
            studentId: studentId,
            instituteId: instituteId,
            name,
            DOB,
            gender,
            address,
            imagePath,
            phoneNumber,
            email: email.toLowerCase(),
            password: hashPassword,
            AdmissionDate: AdmissionDate ||new Date(),
            access: "allowed",
            // Parent information embedded directly in student
            parentName,
            parentPhoneNumber,
            parentEmail: parentEmail.toLowerCase(),
            relation,
            occupation,
            emergencyContact,
            parentPassword: parentHashPassword,
            programIds: [programId],
            batchIds: [batchId],
        });

        await newStudent.save();

        // If parent doesn't exist, create new parent
        if (!existingParent) {
            const newParent = new Parent({
                parentId,
                instituteId: instituteId,
                name: parentName,
                phoneNumber: parentPhoneNumber,
                email: parentEmail.toLowerCase(),
                password: parentHashPassword,
                joiningDate: new Date(),
                access: "allowed",
                studentsId: [studentId] // Link to this student
            });
            await newParent.save();
            
            // Add parent to institute
            institute.users.parents.push(parentId);
        } else {
            // Update existing parent's studentIds array
            existingParent.studentsId.push(studentId);
            await existingParent.save();
        }

        // Add student to institute
        institute.users.students.push(studentId);
        await institute.save();

        // Return success response (excluding passwords)
        const studentObj = newStudent.toObject ? newStudent.toObject() : newStudent;
        const { password: _, parentPassword: __, ...studentResponse } = studentObj;
        
        res.status(201).json({
            success: true,
            message: "Student enrolled successfully with parent",
            data: studentResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const removeStudent = async(req, res, next) => {
    try {
        const { instituteId, studentId } = req.body;

        // Validate required fields
        if (!instituteId || !studentId) {
            return next(errorHandler(400, "Institute ID and Student ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if student exists in institute's users.students array
        const studentExistsInInstitute = institute.users.students.includes(studentId);
        if (!studentExistsInInstitute) {
            return next(errorHandler(404, "Student not found in this institute"));
        }

        // Find student details from Student collection
        const student = await Student.findOne({ instituteId, studentId });
        if (!student) {
            return next(errorHandler(404, "Student details not found"));
        }

        // Remove student from institute's users.students array
        institute.users.students = institute.users.students.filter(id => id !== studentId);
        await institute.save();

        // Remove student ID from parent's studentIds array
        const parent = await Parent.findOne({ instituteId, email: student.parentEmail });
        if (parent) {
            parent.studentsId = parent.studentsId.filter(id => id !== studentId);
            
            // If parent has no more students, remove parent from institute
            if (parent.studentsId.length === 0) {
                institute.users.parents = institute.users.parents.filter(id => id !== parent.parentId);
                await Parent.deleteOne({ parentId: parent.parentId });
            } else {
                await parent.save();
            }
        }

        // Delete student from Student collection
        await Student.deleteOne({ instituteId, studentId });

        // Return success response (excluding passwords)
        const studentObj = student.toObject ? student.toObject() : student;
        const { password: _, parentPassword: __, ...studentResponse } = studentObj;

        res.status(200).json({
            success: true,
            message: "Student removed successfully",
            data: studentResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const findStudentDetails = async(req, res, next) => {
    try {
        const { instituteId } = req.user;
        const { studentId } = req.params;

        // Validate required fields
        if (!instituteId || !studentId) {
            return next(errorHandler(400, "Institute ID and Student ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if student exists in institute's users.students array
        const studentExistsInInstitute = institute.users.students.includes(studentId);
        if (!studentExistsInInstitute) {
            return next(errorHandler(404, "Student not found in this institute"));
        }

        // Find student details from Student collection
        const student = await Student.findOne({ instituteId, studentId });
        if (!student) {
            return next(errorHandler(404, "Student details not found"));
        }

        // Return student details (excluding passwords)
        const studentObj = student.toObject ? student.toObject() : student;
        const { password: _, parentPassword: __, ...studentResponse } = studentObj;

        res.status(200).json({
            success: true,
            message: "Student details retrieved successfully",
            data: studentResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const updateStudentDetails = async(req, res, next) => {
    try {
        const { instituteId, studentId, ...updateData } = req.body;

        // Validate required fields
        if (!instituteId || !studentId) {
            return next(errorHandler(400, "Institute ID and Student ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if student exists in institute's users.students array
        const studentExistsInInstitute = institute.users.students.includes(studentId);
        if (!studentExistsInInstitute) {
            return next(errorHandler(404, "Student not found in this institute"));
        }

        // Find student from Student collection
        const student = await Student.findOne({ instituteId, studentId });
        if (!student) {
            return next(errorHandler(404, "Student details not found"));
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
            const emailExists = await Student.findOne({ 
                instituteId, 
                email: updateData.email, 
                studentId: { $ne: studentId } 
            });
            if (emailExists) {
                return next(errorHandler(409, "Email already exists with another student"));
            }
        }

        // Update student details
        const updatedStudent = await Student.findOneAndUpdate(
            { instituteId, studentId },
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        // Return updated student details (excluding passwords)
        const studentObj = updatedStudent.toObject ? updatedStudent.toObject() : updatedStudent;
        const { password: _, parentPassword: __, ...studentResponse } = studentObj;

        res.status(200).json({
            success: true,
            message: "Student details updated successfully",
            data: studentResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const findAllStudentsDetails = async(req, res, next) => {
    try {
        const { instituteId } = req.user;

        // Validate required fields
        if (!instituteId) {
            return next(errorHandler(400, "Institute ID is required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Get all students from Student collection for this institute
        const students = await Student.find({ instituteId }, "name studentId imagePath email parentName");

        res.status(200).json({
            success: true,
            message: "All students details retrieved successfully",
            count: students.length,
            data: students
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}
