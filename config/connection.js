require('dotenv').config()

const mongoose = require('mongoose')
const uri = process.env.MONGODB_URL

async function connectDB() {
    try {
        await mongoose.connect(uri)
        console.log('conneccted')
    } catch (error) {
        console.error("Problem connecting to mongoose:", error)
        process.exit(1)
    }

}
module.exports = connectDB