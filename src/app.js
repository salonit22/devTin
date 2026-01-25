const express = require('express');

const app = express()
const {userAuth} = require('./middlewares/auth');
const {connectDB} = require('./config/database');
// app.use('/hello',(req,res) =>{
//     res.send("hello world")
// })

// app.use("/test",(req,res) =>{
//     res.send("hello world from test route")
// })

// query and params
// app.get('/user',(req,res) => {
//     console.log(req.query);
//     res.send({'name': 'saloni','age':'22'})
// })

// app.post('/user',(req,res) => {
//     //logic to post the data 
//     res.send("data is posted successfully")
// })

// app.use('/user',(req,res,next) =>{
//     console.log("middleware is called");
//     next();
// },
// (req,res,next) =>{
//     next();
//     res.send("user route is called")
// });

// app.get('/user',(req,res) =>{
//     res.send("user is get method")
// })
connectDB().then(() =>{
    console.log("database connected successfully")
}).catch((err) =>{  
    console.log("error in db connection", err)
})

app.use('/user', userAuth)
app.get('/user',userAuth,(req,res) =>{
    res.send("user get route is called")
}) 
app.get('/user/data',(req,res)=>{
    res.send("user route is called")
})


app.listen(3000,() =>{
    console.log("running successfully")
})