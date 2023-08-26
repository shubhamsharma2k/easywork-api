import mongoose, { Schema } from 'mongoose'
const Affiliations = new Schema({
    name: {
        type: String || null,
    },
})

const CoursesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    feeAmount: {
        type: String,
        required: true,
    },
    affiliations: { type: Affiliations },
    semesters: {
        type: String,
    },
})

const Courses = mongoose.model('Courses', CoursesSchema)
export default Courses
