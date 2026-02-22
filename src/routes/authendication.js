const express = require('express');
const authRoute = express.Router();
const user = require('../models/user');
const { validateSignUp } = require('../utils/validations');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middlewares/auth');


authRoute.post('/signUp', async (req, res) => {
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
        console.log("New user created:", newUser);

        res.status(201).send({ message: "User registered successfully" })
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).send({ error: "Email already exists" });
        } else {
            res.status(500).send({ error: err.message });
        }
    }
})


authRoute.post('/login', async (req, res) => {
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

authRoute.post('/logout', (req, res) => {
    res.clearCookie("jwtToken");
    res.send({ message: "Logout successful" });
});

module.exports = authRoute;