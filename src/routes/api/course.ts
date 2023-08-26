import express, { Request, Response } from 'express'
import Courses from '../../models/Courses'
const router = express.Router()
const auth = require('../../middleware/auth')

router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const newCourseData = req.body
        const course = new Courses(newCourseData)
        const createdCourse = await course.save()
        return res.status(201).json(createdCourse)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const courses = await Courses.find({})
        if (courses) return res.json(courses)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

router.put('/:id', auth, async (req: Request, res: Response) => {
    try {
        const course = await Courses.findOne({ _id: req.params.id })
        if (course) {
            const newCourseData = req.body
            const updatedResp = await Courses.findOneAndUpdate({ _id: req.params.id }, newCourseData)
            return res.json(updatedResp)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})

router.delete('/:id', auth, async (req: Request, res: Response) => {
    try {
        const course = await Courses.findOneAndDelete({ _id: req.params.id })
        if (course) {
            return res.status(200).json([])
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
})
module.exports = router
