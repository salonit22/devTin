const express = require('express');

const app = express()
const { connectDB } = require('./config/database');
const user = require('./models/user');
const { validateSignUp } = require('./utils/validations');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth } = require('./middlewares/auth');



app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
    console.log("database connected successfully")
}).catch((err) => {
    console.log("error in db connection", err)
})

// post api making 
app.post('/signUp', async (req, res) => {
    try {
        validateSignUp(req);
        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            first_name,
            last_name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).send({ message: "User registered successfully" })
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send({ error: "Email already exists" });
        } else {
            res.status(500).send({ error: err.message });
        }
    }
})

// get api making get profile by findOne
app.get('/profile', async (req, res) => {
    const name = req.body.first_name;
    try {
        const data = await user.findOne({ 'first_name': name })
        console.log(data)
        if (!data) {
            res.status(404).send('No user found')
        } else {
            res.send(data)
        }
    } catch (err) {
        console.log("error in fetching profile data", err)
    }
})

//get api to find all data
app.get('/getAllProfile', async (req, res) => {
    try {
        const data = await user.find({})
        res.send(data)
    } catch (err) {
        console.log("error in fetching profile data", err)

    }
})

// delete api making delete profile by findOneAndDelete
app.delete('/profile', async (req, res) => {
    const userID = req.body.userId;
    try {
        const data = await user.findByIdAndDelete(userID)
        if (!data) {
            res.status(404).send('user not found')
        } else {
            res.send('user deleted sucessfully')
        }
    }
    catch (err) {
        console.log("error in fetching profile data", err)
    }
})

// update api making post profile by findByIdAndUpdate
app.patch('/profile/:userID', async (req, res) => {
    const userID = req.params.userID;
    const updateData = req.body;
    const allowedUpdates = ['first_name', 'last_name', 'age', 'about', 'skills', 'gender'];

    const isAllowedUpdate = Object.keys(updateData).every((key) => allowedUpdates.includes(key));
    if (!isAllowedUpdate) {
        return res.status(400).send({ error: "Invalid update fields" });
    }
    try {
        const data = await user.findByIdAndUpdate(userID, updateData, { returnDocument: 'after' });
        if (!data) {
            res.status(404).send('user not found')
        } else {
            res.send(data)
        }
    } catch (err) {
        console.log("error in updating profile data", err)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const isexistingUser = await user.findOne({ email })
        if (!isexistingUser) {
            console.log("user doesnt exist")
            res.status(400).send('user doesnt exist')
        } else {
            const token = await isexistingUser.getJWTToken();
            res.cookie("jwtToken", token)

            const isPasswordMatch = await isexistingUser.passwordCheck(password);
            if (!isPasswordMatch) {
                res.status(400).send('invalid password')
            }
            res.send({ message: "Login successful"});
        }
    } catch (err) {
        res.status(400).send(err)
    }
})

app.get('/info', userAuth,async (req, res) => {
    const token = req.cookies?.jwtToken;
    try {
        res.send(req.user);
    } catch (err) {
        res.status(401).send('Unauthorized', err);
    }
})

app.listen(3000, () => {
    console.log("running successfully")
})