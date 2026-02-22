const express = require('express')
const connectionRouter = express.Router()
const connectionReq = require('../models/connectionRequest.js')
const { userAuth } = require('../middlewares/auth.js')
const connectionRequest = require('../models/connectionRequest.js')
const user = require('../models/user.js')

connectionRouter.post('/request/send/:status/:toUserID', userAuth , async (req, res) => {

    try{
    const fromUserID = req.user._id;
    const toUserID = req.params.toUserID;
    const status = req.params.status;

    const allowedStatuses = ['ignored','interested'];
    if(!allowedStatuses.includes(status)){
        return res.status(400).send('Invalid status')

    }

    const isExistingConnectionReq = await connectionReq.findOne({
        $or:[
            {fromUserID, toUserID},
            {fromUserID : toUserID, toUserID : fromUserID}
        ]
    })

    if(isExistingConnectionReq){
        return res.status(400).send('Connection already exists')
    }

    const touser = await user.findById(toUserID)
    if(!touser){
        return res.status(400).send('user not found')
    }

    if(fromUserID.toString() === toUserID){
        return res.status(400).send('cannot send request to yourself')
    }
    const data = new connectionReq({
        fromUserID,
        toUserID,
        status
    })
    await data.save()

    res.status(200).send('connection sent successfully')

} catch(err){
    res.status(400).send('ERROR '+ err)
}

})

connectionRouter.post('/request/review/:status/:requestId', userAuth , async (req, res) =>{

    try{
        const logedinUserId = req.user._id;
        const status = req.params.status;

        const allowedStatuses = ['accecpted', 'rejected']
        if(!allowedStatuses.includes(status)){
            return res.status(400).send('request status not allowed')
        }

        const data = await connectionRequest.findOne({
            _id : req.params.requestId,
            toUserID : logedinUserId,
            status : 'interested'
        })
        if(!data){
           return res.status(400).send('connection req not found')
        }
        data.status = req.params.status
        await data.save()
        res.status(200).send(`connection ${req.params.status}`)
    }catch(err){
        res.status(400).send('ERROR '+ err)
    }
})



module.exports = connectionRouter