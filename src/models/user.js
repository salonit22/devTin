const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
    },
    last_name: {
        type: String,
        optional: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        min: 18,
    },
    about: {
        type: String,
        default: 'This is my about section'
    },
    skills: {
        type: [String]
    },
    gender: {
        type: String,
        validate(value) {
            const validGenders = ['male', 'female', 'other'];
            if (!validGenders.includes(value)) {
                throw new Error('Invalid gender value');
            }
        }
    }
},{
    timestamps: true
})

module.exports = mongoose.model('user', UserSchema)   
