const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
        first_name : {
            type: String
        },
        last_name : {
            type: String 
        },
        age :{
            type: String
        }
    
})

module.exports = mongoose.model('user', UserSchema)   
