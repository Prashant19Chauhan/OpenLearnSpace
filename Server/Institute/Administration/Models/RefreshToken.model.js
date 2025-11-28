import mongoose from "mongoose";

const RefreshToken = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

export default mongoose.model("InstituteRefreshToken", RefreshToken);