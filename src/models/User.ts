import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: { type: String },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
})

const User = mongoose.model('User', UserSchema)
export default User
