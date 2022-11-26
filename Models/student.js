const { Schema, model } = require('mongoose')

const StudentSchema = new Schema({
    Name: {
        type: String
    },
    Gender: {
        type: String
    },
    Age: {
        type: Number
    },
    Class: {
        type: Number
    },
    Section: {
        type: String
    }
}, { timestamps: true })

const Student = model('student', StudentSchema)

module.exports = Student