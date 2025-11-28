import Institute from "../Models/Institute.model.js"
import Employee from "../Models/Employee.model.js"
import { errorHandler } from "../../../Utils/Error.js"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone); // Indian number
const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).{8,}$/.test(password);

export const hireEmployee = async(req, res, next) => {

    try {
        const { instituteId } = req.user;
        const { 
            name,
            gender,
            DOB,
            nationality,
            maritalStatus,
            permanentAddress,
            currentAddress,
            phoneNumber, 
            email,
            department,
            designation,
            joiningDate,
            employmentType,
            supervisor, 
            role,
            educationQualification
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

        // Check if employee already exists in this institute with this email
        const existingEmployee = await Employee.findOne({ instituteId, email });
        
        if (existingEmployee) {
            return next(errorHandler(409, "Employee already exists with this email in this institute"));
        }

        const password = "Moodle@123"
        const hashPassword = await bcrypt.hash(password, 10)
        const employeeId = "INST-EMP-" + nanoid(12)
        
        // Create new employee object
        const newEmployee = new Employee({
            employeeId: employeeId,
            instituteId: instituteId, // Add missing instituteId field
            name,
            gender,
            DOB,
            nationality,
            maritalStatus,
            permanentAddress,
            currentAddress,
            phoneNumber, 
            email, 
            imagePath,
            department,
            designation,
            joiningDate: joiningDate || new Date(),
            employmentType: employmentType || "fullTime",
            supervisor: supervisor || "admin", 
            role,
            educationQualification,
            password: hashPassword,
            access: "not allowed", // Default access status
        });

        await newEmployee.save();

        // Add employee to institute's users.employees array
        institute.users.employees.push(employeeId);
        await institute.save();

        // Return success response (excluding password)
        const employeeObj = newEmployee.toObject ? newEmployee.toObject() : newEmployee;
        const { password: _, ...employeeResponse } = employeeObj;
        
        res.status(201).json({
            success: true,
            message: "Employee hired successfully",
            data: employeeResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const fireEmployee = async(req, res, next) => {
    try {
        const { instituteId, employeeId } = req.body;

        // Validate required fields
        if (!instituteId || !employeeId) {
            return next(errorHandler(400, "Institute ID and Employee ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if employee exists in institute's users.employees array
        const employeeExistsInInstitute = institute.users.employees.includes(employeeId);
        if (!employeeExistsInInstitute) {
            return next(errorHandler(404, "Employee not found in this institute"));
        }

        // Find employee details from Employee collection
        const employee = await Employee.findOne({ employeeId, instituteId });
        if (!employee) {
            return next(errorHandler(404, "Employee details not found"));
        }

        // Remove employee from institute's users.employees array
        institute.users.employees = institute.users.employees.filter(id => id !== employeeId);
        await institute.save();

        // Delete employee from Employee collection
        await Employee.deleteOne({ employeeId, instituteId });

        // Return success response (excluding password)
        const employeeObj = employee.toObject ? employee.toObject() : employee;
        const { password: _, ...employeeResponse } = employeeObj;

        res.status(200).json({
            success: true,
            message: "Employee fired successfully",
            data: employeeResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const findEmployeeDetails = async(req, res, next) => {
    try {
        const { instituteId } = req.user;
        const { employeeId } = req.params;

        // Validate required fields
        if (!instituteId || !employeeId) {
            return next(errorHandler(400, "Institute ID and Employee ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if employee exists in institute's users.employees array
        const employeeExistsInInstitute = institute.users.employees.includes(employeeId);
        if (!employeeExistsInInstitute) {
            return next(errorHandler(404, "Employee not found in this institute"));
        }

        // Find employee details from Employee collection
        const employee = await Employee.findOne({ instituteId, employeeId });
        if (!employee) {
            return next(errorHandler(404, "Employee details not found"));
        }

        // Return employee details (excluding password)
        const employeeObj = employee.toObject ? employee.toObject() : employee;
        const { password: _, ...employeeResponse } = employeeObj;

        res.status(200).json({
            success: true,
            message: "Employee details retrieved successfully",
            data: employeeResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const updateEmployeeDetails = async(req, res, next) => {
    try {
        const { instituteId, employeeId, ...updateData } = req.body;

        // Validate required fields
        if (!instituteId || !employeeId) {
            return next(errorHandler(400, "Institute ID and Employee ID are required"));
        }

        // Check if institute exists
        const institute = await Institute.findOne({ instituteId });
        if (!institute) {
            return next(errorHandler(404, "Institute not found"));
        }

        // Check if employee exists in institute's users.employees array
        const employeeExistsInInstitute = institute.users.employees.includes(employeeId);
        if (!employeeExistsInInstitute) {
            return next(errorHandler(404, "Employee not found in this institute"));
        }

        // Find employee from Employee collection
        const employee = await Employee.findOne({ instituteId, employeeId });
        if (!employee) {
            return next(errorHandler(404, "Employee details not found"));
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
            const emailExists = await Employee.findOne({ 
                instituteId, 
                email: updateData.email, 
                employeeId: { $ne: employeeId } 
            });
            if (emailExists) {
                return next(errorHandler(409, "Email already exists with another employee"));
            }
        }

        // Update employee details
        const updatedEmployee = await Employee.findOneAndUpdate(
            { instituteId, employeeId },
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        // Return updated employee details (excluding password)
        const employeeObj = updatedEmployee.toObject ? updatedEmployee.toObject() : updatedEmployee;
        const { password: _, ...employeeResponse } = employeeObj;

        res.status(200).json({
            success: true,
            message: "Employee details updated successfully",
            data: employeeResponse
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}

export const findAllEmployeesDetails = async(req, res, next) => {
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

        // Get all employees from Employee collection for this institute
        const employees = await Employee.find({instituteId}, "name employeeId department imagePath designation access phoneNumber email");

        res.status(200).json({
            success: true,
            message: "All employees details retrieved successfully",
            count: employees.length,
            data: employees
        });

    } catch (error) {
        next(errorHandler(500, error.message || "Internal server error"));
    }
}
