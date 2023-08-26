import express, { Request, Response } from 'express'
import Student from '../../models/Student'
import Courses from '../../models/Courses'
const router = express.Router()
const auth = require('../../middleware/auth')

router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const totalStudents = await Student.find({})
        const {
            firstName,
            lastName,
            email,
            dateOfBirth,
            fathersName,
            mothersName,
            fatherOccupation,
            motherOccupation,
            residentialAddress,
            primaryPhone,
            secondaryPhone,
            nationality,
            courseInfo,
            dateOfAdmission,
            session,
        } = req.body

        const course = await Courses.findById(courseInfo.id)
        let studentDataToPost = {
            studentId: totalStudents.length + 1,
            firstName,
            lastName,
            email,
            dateOfBirth,
            fathersName,
            mothersName,
            fatherOccupation,
            motherOccupation,
            residentialAddress,
            primaryPhone,
            secondaryPhone,
            nationality,
            dateOfAdmission,
            courseInfo: {
                course: course,
                ...courseInfo,
            },
            session,
        }

        const newStudent = new Student(studentDataToPost)
        const createdStudent = await newStudent.save()
        return res.status(201).json(createdStudent)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
})

router.get('/', auth, async (req: Request, res: Response) => {
    try {
        let students = await Student.find({})
        let studentDetails: any[] = []
        if (students) {
            for (let student of students) {
                if (student) {
                    let studentDetail: any = {
                        studentId: student.studentId,
                        firstName: student.firstName,
                        lastName: student.lastName,
                        email: student.email,
                        dateOfBirth: student.dateOfBirth,
                        fathersName: student.fathersName,
                        mothersName: student.mothersName,
                        fatherOccupation: student.fatherOccupation,
                        motherOccupation: student.motherOccupation,
                        residentialAddress: student.residentialAddress,
                        primaryPhone: student.primaryPhone,
                        secondaryPhone: student.secondaryPhone,
                        nationality: student.nationality,
                        dateOfAdmission: student.dateOfAdmission,
                        session: student.session,
                        courseInfo: {
                            scholarship: student.courseInfo?.scholarship,
                            amountPaid: student.courseInfo?.amountPaid,
                            amountPending: student.courseInfo?.amountPending,
                            transactions: student.courseInfo?.transactions,
                        },
                    }

                    let idOfCourse = student.courseInfo?.course?._id
                    if (idOfCourse) {
                        let courseDetails = await Courses.findById(idOfCourse)
                        if (courseDetails) {
                            studentDetail.courseInfo.course = courseDetails
                            studentDetails.push(studentDetail)
                        }
                    }
                }
            }
        }
        return res.status(200).json(studentDetails)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

router.put('/:id', auth, async (req: Request, res: Response) => {
    try {
        const student = await Student.findOne({ studentId: req.params.id })
        console.log(student)
        if (student) {
            const newStudentData = req.body
            const updatedResp = await Student.findOneAndUpdate({ studentId: req.params.id }, newStudentData)
            return res.json(newStudentData)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        const student = await Student.findOneAndDelete({
            studentId: req.params.id,
        })

        return res.status(200).json([])
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router
