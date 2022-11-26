const express = require('express')
require('./MongoDB')
const Student = require('./Models/student')

const app = express()
const PORT = process.env.PORT || 3000

// middlewares
app.use(express.json())

// routes
// create student
app.post('/api/student', async (req, res) => {
    const { Name, Gender, Class, Section } = req.body
    if (Name === undefined) return res.status(400).json({
        message: "Please enter name."
    })
    if (Gender === undefined) return res.status(400).json({
        message: "Please enter gender."
    })
    if (Class === undefined) return res.status(400).json({
        message: "Please enter class."
    })
    if (Section === undefined) return res.status(400).json({
        message: "Please enter section."
    })
    try {
        const presentStudent = await Student.findOne({ Name })
        if (presentStudent !== null) {
            return res.status(403).json({
                message: `Student present with name ${Name}.`
            })
        } else {
            const newStudent = Student({ Name, Gender, Class, Section })
            const savedStudent = await newStudent.save()
            const { createdAt, updatedAt, __v, ...rest } = savedStudent._doc
            return res.status(200).json(rest)
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// get all students
app.get('/api/student', async (req, res) => {
    try {
        const students = await Student.find()
        if (students.length !== 0) {
            return res.status(200).json(students)
        } else {
            return res.status(404).json({
                message: "No students found."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// search student by name
app.get('/api/student/:name', async (req, res) => {
    const Name = req.params.name
    try {
        const student = await Student.find({ Name: { $regex: Name, $options: 'i' } })
        if (student.length !== 0) {
            return res.status(200).json(student)
        } else {
            return res.status(404).json({
                message: `Student not found with name ${Name}.`
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// delete student by name
app.delete('/api/student/:name', async (req, res) => {
    const Name = req.params.name
    try {
        const student = await Student.findOne({ Name })
        if (student === null) return res.status(404).json({
            message: `Student not found with name ${Name}.`
        })
        const deletedStudent = await Student.findOneAndDelete({ Name })
        if (deletedStudent) return res.status(200).json({
            message: `Student with name ${Name} deleted.`
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// update student
app.patch('/api/student/:name', async (req, res) => {
    const Name = req.params.name
    try {
        const student = await Student.findOne({ Name })
        if (student === null) return res.status(404).json({
            message: `Student not found with name ${Name}.`
        })
        const updatedStudent = await Student.findOneAndUpdate({ Name }, { 
            Name: req.body.Name,
            Class: req.body.Class,
            Gender: req.body.Gender,
            Section: req.body.Section
         })
        const { createdAt, updatedAt, __v, ...rest } = updatedStudent._doc
        res.status(200).send(rest)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`)
})