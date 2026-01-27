const express = require('express');

const app = express()
const { userAuth } = require('./middlewares/auth');
const { connectDB } = require('./config/database');
const user = require('./models/user');
const { validateSignUp } = require('./utils/validations');
const bcrypt = require('bcrypt');


app.use(express.json());

connectDB().then(() => {
    console.log("database connected successfully")
}).catch((err) => {
    console.log("error in db connection", err)
})

// post api making 
app.post('/signUp', async (req, res) => {
    try {
        validateSignUp(req);
        const {first_name,last_name,email,password} = req.body;
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
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({ error: "Invalid email or password" });
        } else {
            const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordMatch) {
                return res.status(400).send({ error: "Invalid email or password" });
            }
            res.send({ message: "Login successful" });
        }
    }
    catch (err) {
        console.log("error in login", err)
    }
})

app.listen(3000, () => {
    console.log("running successfully")
})