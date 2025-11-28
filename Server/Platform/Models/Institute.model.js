import mongoose from "mongoose"

const institute = new mongoose.Schema({
    instituteId: {
        type: String,
        default: () => 'INST-' + nanoid(12),
        unique: true,
        index: true,
    },
    instituteName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    primaryEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    primaryPhoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    programIds: {
        type: [String],
        default: []
    },
    batchIds: {
        type: [String],
        default: []
    },
    subjectIds: {
        type: [String],
        default: []
    },
    access: {
        type: String,
        enum: ['allowed', 'restricted'],
        default: 'allowed'
    },
    activeStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    joiningDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export default mongoose.model("instituteList", institute)