const mongoose = require('mongoose');


const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://salonithiyagu:KEUvDvGGr_WYpC3@mynodeproject.ywc9ndx.mongodb.net/')
}

module.exports = { connectDB }