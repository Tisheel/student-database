const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('MongoDB Connected')
})
.catch((error) => {
    console.log(error)
})