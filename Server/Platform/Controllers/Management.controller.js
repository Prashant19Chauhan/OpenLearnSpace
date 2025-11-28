import { errorHandler } from "../../Utils/Error.js";
import AdminUser from "../Models/Admin.model.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getAllUsers = async (req, res, next) => {
    try {
      const users = await AdminUser.find({}, "name role"); 
      // ^ excludes password field from response
  
      res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (err) {
      return next(errorHandler(500, err.message || "Failed to fetch users"));
    }
};

export const deleteUser = async(req, res, next) => {
    try{
        const{ id } = req.body;

        const findUser = await AdminUser.findById(id);
        if(!findUser) return next(errorHandler(400, "User not found"));
        if(findUser.role === "admin") return next(errorHandler(400, "Admin cannot be deleted"))

        await AdminUser.deleteOne({_id: id});

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    }catch(error){
        return next(errorHandler(500, error.message || "internal server error"));
    }
}

export const findUser = async(req, res, next) => {
    try{
        const {id} = req.body;
  
        // Find user
        const userDetails = await AdminUser.findById( id ).select("-password"); 
        // 👆 excludes password field
  
        if (!userDetails) {
            return next(errorHandler(404, "User not found"));
        }
  
        res.status(200).json({
            success: true,
            message: "User found successfully",
            user: userDetails,
        });

    }catch(error){
        return next(errorHandler(500, error.message || "internal server error"));
    }
}

export const updateUser = async(req, res, next) => {
    try{
        const { _id, name, username, email, phoneNumber, password, role, permissions } = req.body;
        // Check if ID is provided
        if (!_id) {
            return next(errorHandler(400, "User ID is required"));
        }
  
        // Find the user
        const user = await AdminUser.findById(_id);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
  
        // Update fields if provided
        if (name) user.name = name;
        if (username) user.username = username;
        if (email) {
            if (!isValidEmail(email)) {
                return next(errorHandler(400, "Invalid email format"));
            }
            user.email = email;
        }
        if (phoneNumber) user.phoneNumber = phoneNumber;
  
        // Update password only if provided
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(password, salt);
        }
  
        if (role) user.role = role;
        if (permissions) user.permissions = permissions;
  
        // Save updated user
        const updatedUser = await user.save();
  
        // Exclude password in response
        const { password: pwd, ...userWithoutPassword } = updatedUser.toObject();
  
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: userWithoutPassword,
        });
    }catch(error){
        return next(errorHandler(500, error.message || "internal server error"));
    }

}

export const updatePassword = async(req, res, next) => {
    try{
        const {email, oldPassword, newPassword} = req.body;
        const findUser = await AdminUser.findOne({email});
        if(!findUser) return next(errorHandler(400, "User not found"))
        const isMatch = await bcryptjs.compare(oldPassword, findUser.password);
        if (!isMatch) return next(errorHandler(400, "Invalid old password"));
        const hashPassword = await bcryptjs.hash(newPassword, 10);
        findUser.password = hashPassword;
        await findUser.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    }catch(error){
        return next(errorHandler(500, error.message || "internal server error"));
    }
}