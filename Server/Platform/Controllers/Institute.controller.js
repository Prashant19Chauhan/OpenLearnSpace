import { errorHandler } from "../../Utils/Error.js"
import Institute from "../../Institute/Administration/Models/Institute.model.js"
import InstituteEmployee from "../../Institute/Administration/Models/Employee.model.js"
import bcryptjs from "bcryptjs"
import {nanoid} from "nanoid"

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone)
const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,]).{8,}$/.test(password)

export const enroll = async(req, res, next) => {
    try{
      const {instituteName, address, ownerName, primaryEmail, primaryPhoneNumber, password} = req.body
      if(!isValidEmail(primaryEmail)) return next(errorHandler( 400, "Invalid email format"))
      if (!isValidPhone(primaryPhoneNumber)) return next(errorHandler( 400, "Invalid Indian phone number"))
      if (!isValidPassword(password))
        return next(errorHandler( 400, "Password must have 1 uppercase, 1 number, 1 special symbol (.,!@#), min 8 chars"))

      const findPrimaryDetails = await Institute.findOne({
        $or: [{ primaryEmail }, { primaryPhoneNumber }, { password }],
      });
      
      if (findPrimaryDetails) return next(errorHandler(409, "Institute with similar cradential already exists"))

      const hashPassword = await bcryptjs.hash(password, 10);
      const instituteId = 'INST-' + nanoid(12);
      const employeeId="INST-OWN-"+nanoid(12);

      const newInstitute = new Institute({
        instituteId: instituteId,
        instituteName,
        instituteLocation: address,
        ownerName,
        primaryEmail,
        primaryPhoneNumber,
        access: "allowed",
        activeStatus: "active",

      });

      newInstitute.users.employees.push(employeeId);
      await newInstitute.save();

      const newEmployee = new InstituteEmployee({
        instituteId: instituteId,
        employeeId: employeeId,
        name: ownerName,
        phoneNumber: primaryPhoneNumber,
        email: primaryEmail,
        password: hashPassword,
        role: "admin",
        permissions: ["all"],
        access: "allowed",
      });

      await newEmployee.save();

      res.status(201).json({ message: "Institute registered successfully" });

    }catch(error){
        return next(errorHandler(500, error.message || "Institute enrollment Failed."))
    }
}

export const getAllInstitutes = async(req, res, next) => {
  try{
    const instituteslist = await Institute.find({});

    if(!instituteslist) return next(errorHandler(400, "No institute listed"));

    res.status(200).json({
      success: true,
      count: instituteslist.length,
      data: instituteslist,
    })

  }catch(error){
    return next(errorHandler(500, error.message || "Internal server error"));
  }
}

export const findInstituteDetails = async(req, res, next) => {
  try{
    const {id} = req.body;
    const findInstitute = await Institute.findById(id);
    if(!findInstitute) return next(errorHandler(400, "Institute not found"));

    res.status(200).json({
      success:true,
      message:"Institute Info Found",
      InstituteDetails: findInstitute
    })
  }catch(error){
    return next(errorHandler(500, error.message || "Internal server error"));
  }
}

export const updateInstituteDetails = async(req, res, next) => {
  try{
    const {instituteId, instituteName, address, ownerName, primaryEmail, primaryPhoneNumber} = req.body;

    // Find institute
    const institute = await Institute.findOne({instituteId});
    if (!institute) {
      return next(errorHandler(404, "Institute not found"));
    }

    // Update only provided fields
    if (instituteName) institute.instituteName = instituteName;
    if (address) institute.address = address;
    if (ownerName) institute.ownerName = ownerName;
    if (primaryEmail) {
      if (!isValidEmail(primaryEmail)) {
        return next(errorHandler(400, "Invalid email format"));
      }
      institute.primaryEmail = primaryEmail;
    }
    if (primaryPhoneNumber) institute.primaryPhoneNumber = primaryPhoneNumber;

    const updatedInstitute = await institute.save();

    // Exclude password in response
    const {instituteWithoutPassword} = updatedInstitute.toObject();

    res.status(200).json({
      success: true,
      message: "Institute details updated successfully",
      institute: instituteWithoutPassword,
    });

  }catch(error){
    return next(errorHandler(500, error.message || "Internal server error"));
  }
}