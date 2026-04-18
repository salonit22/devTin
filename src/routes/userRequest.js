const express = require('express')
const { userAuth } = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');
const userRouter = express.Router()
const user = require('../models/user');

userRouter.get('/users/request/recevied',userAuth, async(req, res) =>{
    try{
        const loggedInUser = req.user;

        const connectionList = await connectionRequest.find({ 
            toUserID : loggedInUser._id,
            status: "interested"
        }).populate('fromUserID',['first_name','last_name','photoUrl','age','gender','skills','about'])


        if(connectionList.length <= 0){
           return res.status(400).send({ error: "No Connections" });
        }
        res.json({
            message : 'connection list',
            data : connectionList
        }
            
        )
    }catch(err){
         console.log("error in fetching connection data", err)
         res.status(400).send({message : err.message})
    }
})

userRouter.get('/user/connections' , userAuth, async(req,res) =>{
    try{
        const loggedInUser = req.user
        const connections = await connectionRequest.find({
            $or : [
                {toUserID : loggedInUser._id, status: 'accecpted'},
                {fromUserID : loggedInUser._id, status: 'accecpted'}
            ]
        }).populate('fromUserID',['first_name','last_name','photoUrl','age','gender','skills']).populate('toUserID',['first_name','last_name','photoUrl','age','gender','skills'])

        const connection = connections.map(x =>{
            if(loggedInUser._id.toString() == x.fromUserID._id.toString()){
                return x.toUserID
            }
            return x.fromUserID
        })

        res.json({data : connection})

    }catch(err){
        res.status(400).send({message : err.message})
    }
})


userRouter.get('/user/feed', userAuth, async (req,res) =>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limt = parseInt(req.query.limt) || 10;
        limt = limt > 50 ? 50 : limt;
        const skip = (page - 1)*limt

        
        const connections = await connectionRequest.find({
            $or: [
                {toUserID : loggedInUser._id},{fromUserID: loggedInUser._id}
            ]
        }).select("fromUserID toUserID")

        const hideUserFromFeed = new Set();
        connections.forEach((conn) => {
            hideUserFromFeed.add(conn.toUserID.toString());
            hideUserFromFeed.add(conn.fromUserID.toString());
        })

        const feedList = await user.find({
            $and: [
                {_id : {$nin :  Array.from(hideUserFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select("first_name last_name photoUrl")
        res.send(feedList)

    }catch(err){
        res.status(404).json({message : err.message})
    }
})


module.exports = userRouter