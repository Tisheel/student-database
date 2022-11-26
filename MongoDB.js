const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://tisheel:tisheel@cluster0.lssrxeg.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    console.log('MongoDB Connected')
})
.catch((error) => {
    console.log(error)
})