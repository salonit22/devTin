const express = require('express');
const profileRouter = express.Router();
const user = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateProfileUpdates } = require('../utils/validations');


// get api making get info of logged in user
profileRouter.get('/info', userAuth,async (req, res) => {
    const token = req.cookies?.jwtToken;
    try {
        res.send(req.user);
    } catch (err) {
        res.status(401).send('Unauthorized', err);
    }
})

// get api making get profile by findOne
profileRouter.get('/profile', async (req, res) => {
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
profileRouter.get('/getAllProfile', async (req, res) => {
    try {
        const data = await user.find({})
        res.send(data)
    } catch (err) {
        console.log("error in fetching profile data", err)

    }
})

// edit profile api using patch method
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

    try {
        if (!validateProfileUpdates(req)) {
            return res.status(400).send({ error: "Invalid update fields" });
        }
       const loggedInUserId = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUserId[key] = req.body[key];
        });
        await loggedInUserId.save();
        res.send(`Profile updated successfully for user: ${loggedInUserId.first_name}`);
       
    } catch (err) {
         if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(err => err.message);

      return res.status(400).send({
        success: false,
        errors
      });
    }

    res.status(500).send({
      success: false,
      message: 'Something went wrong'
    });
    }
})


// delete api making delete profile by findOneAndDelete
profileRouter.delete('/profile', async (req, res) => {
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

module.exports = profileRouter;
