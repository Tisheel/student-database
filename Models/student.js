const { Schema, model } = require('mongoose')

const StudentSchema = new Schema({
    Name: {
        type: String
    },
    Gender: {
        type: String
    },
    Class: {
        type: String
    },
    Section: {
        type: String
    }
}, { timestamps: true })

const Student = model('student', StudentSchema)

module.exports = Student