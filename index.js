const express = require('express')
const Student = require('./Models/student')
const bodyparser = require('body-parser')
const { isEmpty } = require('validator')
const path = require("path")
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// connect to DB
require('./MongoDB')

// middlewares
app.use(bodyparser.json())
app.use(express.json())
app.use(express.static("public"))

// routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})
// create student
app.post('/api/student', async (req, res) => {
    const { Name, Gender, Class, Section } = req.body
    if (isEmpty(Name)) return res.status(400).json({
        message: "Please enter name"
    }) 
    if (isEmpty(Class)) return res.status(400).json({
        message: "Please enter class"
    }) 
    if (isEmpty(Section)) return res.status(400).json({
        message: "Please enter section"
    }) 
    if (isEmpty(Gender)) return res.status(400).json({
        message: "Please enter gender"
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
        res.status(200).json({
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