const express = require('express');

const app = express()
const { connectDB } = require('./config/database');
const user = require('./models/user');
const cookieParser = require("cookie-parser");



app.use(express.json());
app.use(cookieParser());
const authRoute = require('./routes/authendication');
const profileRoute = require('./routes/profile');
const connectionRouter = require('./routes/connection');
const userRouter = require('./routes/userRequest');

app.use('/', authRoute);
app.use('/', profileRoute);
app.use('/', connectionRouter);
app.use('/',userRouter)

connectDB().then(() => {
    console.log("database connected successfully")
}).catch((err) => {
    console.log("error in db connection", err)
})


app.listen(3000, () => {
    console.log("running successfully")
})