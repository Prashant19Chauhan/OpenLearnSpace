import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
})

export default mongoose.model("refreshToken", RefreshTokenSchema);