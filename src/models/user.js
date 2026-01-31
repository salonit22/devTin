const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');   
const bcrypt = require('bcrypt'); 

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
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {   
                throw new Error('Invalid email address');
            }
        }
    },
    password: {
        
        type: String,
         validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Enter a strong password');
            }
        }
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
    },
    photoUrl: {
        type: String,
        default: 'https://example.com/default-profile.png',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL for photoUrl');
            }
        }
    }
}, {
    timestamps: true
})

UserSchema.methods.getJWTToken = async function() {
    const token = await jwt.sign({ email: this.email }, 'secretKey');
    console.log("generated token:", token);
    return token;
}

UserSchema.methods.passwordCheck = async function(password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('user', UserSchema, )   
